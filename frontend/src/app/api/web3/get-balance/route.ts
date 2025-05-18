import { NextResponse } from "next/server";
import { getTokenBalance, CONTRACTS } from "@/lib/web3";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const token = searchParams.get("token") || "USDC";

    console.log(`Balance request - Address: ${address}, Token: ${token}`);

    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }

    // Get the token contract address
    const tokenAddress = CONTRACTS[token as keyof typeof CONTRACTS]?.address;
    
    if (!tokenAddress) {
      return NextResponse.json(
        { error: `Unsupported token: ${token}` },
        { status: 400 }
      );
    }

    console.log(`Using token address: ${tokenAddress} for token: ${token}`);

    try {
      console.log(`Calling Alchemy API for address: ${address} and token: ${tokenAddress}`);
      const balanceData = await getTokenBalance(address, tokenAddress);
      console.log("Alchemy API response:", JSON.stringify(balanceData));
      
      // Safely extract the token balance
      const rawBalance = balanceData?.tokenBalances?.[0]?.tokenBalance || "0";
      console.log(`Raw balance: ${rawBalance}`);
      
      const formattedBalance = formatBalance(rawBalance, token);
      console.log(`Formatted balance: ${formattedBalance}`);
      
      // Format the response
      return NextResponse.json({
        address,
        token,
        tokenAddress,
        balance: rawBalance,
        formattedBalance,
      });
    } catch (alchemyError) {
      console.error("Alchemy API error:", alchemyError);
      
      // Return an informative error
      return NextResponse.json(
        { 
          error: "Failed to connect to blockchain network",
          details: alchemyError instanceof Error ? alchemyError.message : String(alchemyError),
          token,
          address
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch token balance" },
      { status: 500 }
    );
  }
}

// Helper function to format the balance based on token decimals
function formatBalance(balance: string, token: string): string {
  const decimals = CONTRACTS[token as keyof typeof CONTRACTS]?.decimals || 
                 (token === "USDC" ? 6 : 18); // Fallback
  
  if (balance === "0") return "0.00";
  
  try {
    // Convert hex to decimal if needed
    const decimalValue = balance.startsWith("0x") 
      ? BigInt(balance).toString(10) 
      : balance;
      
    // Handle the decimals
    const balanceNumber = parseFloat(decimalValue) / Math.pow(10, decimals);
    return balanceNumber.toFixed(2);
  } catch (error) {
    console.error("Error formatting balance:", error, "for balance:", balance);
    return "0.00";
  }
}
