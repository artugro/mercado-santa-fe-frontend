"use client";

import { ContractWrite } from "./debug/_components/contract/ContractWrite";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BalanceCurrency } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const USDCToken: ContractName = "USDC";
  const XOCToken: ContractName = "XOC";
  const MercadoSantaFe: ContractName = "MercadoSantaFe";
  const getUserLoanIds = "getUsersLoanIds";
  const getLoan = "getLoan";

  const { data: USDCTokenContractInfo } = useDeployedContractInfo(USDCToken);
  const { data: XOCTokenContractInfo } = useDeployedContractInfo(XOCToken);
  const { data: MercadoSantaFeContractInfo } = useDeployedContractInfo(MercadoSantaFe);

  const { data: getUserLoanIdsData } = useScaffoldReadContract({
    contractName: MercadoSantaFe,
    functionName: getUserLoanIds,
    args: [connectedAddress],
  });

  console.log(getUserLoanIdsData);

  // If userloanid is 0 don't call otherwise map each id and append to an array of loan data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: getLoanData } = useScaffoldReadContract({
    contractName: MercadoSantaFe,
    functionName: getLoan,
    args: [1n],
  });
  console.log(getLoanData);

  interface TokenBalance {
    contractName: string;
    contractAddress: string | undefined;
    currencyCode: string;
  }

  const tokenBalances: TokenBalance[] = [
    {
      contractName: USDCToken,
      contractAddress: USDCTokenContractInfo?.address,
      currencyCode: "USD",
    },
    {
      contractName: XOCToken,
      contractAddress: XOCTokenContractInfo?.address,
      currencyCode: "MXN",
    },
  ];

  type Loan = {
    id: number;
    amount: number;
    totalPayment: number;
    installments: number;
    apy: number;
    duration: string;
    attachedCollateral: string;
  };

  const loans: Loan[] = [
    {
      id: 1,
      amount: 10000,
      totalPayment: 11500,
      installments: 12,
      apy: 5.5,
      duration: "1 year",
      attachedCollateral: "None",
    },
    {
      id: 2,
      amount: 200000,
      totalPayment: 250000,
      installments: 360,
      apy: 3.2,
      duration: "30 years",
      attachedCollateral: "Property",
    },
    {
      id: 3,
      amount: 25000,
      totalPayment: 28000,
      installments: 60,
      apy: 4.7,
      duration: "5 years",
      attachedCollateral: "Vehicle",
    },
  ];

  const loanIdentifiers = ["Amount", "Total Payment", "Installments", "APY", "Duration", "Attached Collateral"];

  return (
    <>
      <div className="token-balances-container">
        {tokenBalances.map((token, index) => (
          <div key={index} className="token-card">
            <div className="token-card-header">
              <h2 className="token-card-title">{token.contractName}</h2>
            </div>
            <div className="token-card-content">
              <p className="my-2 font-medium">Balance:</p>
              <BalanceCurrency address={token.contractAddress} currencyCode={token.currencyCode} />
            </div>
          </div>
        ))}
        <style jsx>{`
          .token-balances-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          @media (min-width: 640px) {
            .token-balances-container {
              flex-direction: row;
            }
          }

          .token-card {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            overflow: hidden;
            background-color: white;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          }

          .token-card-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .token-card-title {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: #1a202c;
          }

          .token-card-content {
            padding: 1.25rem 1.5rem;
          }

          .token-balance {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
          }
        `}</style>
      </div>
      <div className="loan-detail-container">
        <div className="p-5 divide-y divide-base-300 loan-card">
          <ContractWrite deployedContractData={MercadoSantaFeContractInfo} />
        </div>
        <div className="p-5 divide-y divide-base-300 loan-card">
          <div className="loan-card-header">
            <h2 className="loan-card-title">Loan summary</h2>
          </div>
          <div className="loan-card-content">
            <div className="container mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Concept</th>
                      {loans.map((loan, index) => (
                        <th key={loan.id} className="border border-gray-300 px-4 py-2 text-left">
                          Loan {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loanIdentifiers.map((identifier, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{identifier}</td>
                        {loans.map(loan => (
                          <td key={loan.id} className="border border-gray-300 px-4 py-2">
                            {identifier === "Amount" && `$${loan.amount.toLocaleString()}`}
                            {identifier === "Total Payment" && `$${loan.totalPayment.toLocaleString()}`}
                            {identifier === "Installments" && loan.installments}
                            {identifier === "APY" && `${loan.apy}%`}
                            {identifier === "Duration" && loan.duration}
                            {identifier === "Attached Collateral" && loan.attachedCollateral}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .loan-detail-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          @media (min-width: 640px) {
            .loan-detail-container {
              flex-direction: row;
            }
          }

          .loan-card {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            overflow: hidden;
            background-color: white;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          }

          .loan-card-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .loan-card-title {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: #1a202c;
          }

          .loan-card-content {
            padding: 1.25rem 1.5rem;
          }
        `}</style>
      </div>
    </>
  );
};

export default Home;
