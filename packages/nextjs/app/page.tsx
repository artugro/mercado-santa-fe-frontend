"use client";

import { ContractWrite } from "./debug/_components/contract/ContractWrite";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BalanceCurrency } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const USDCToken: ContractName = "USDCToken";
  const XOCToken: ContractName = "XOCToken";
  const MercadoSantaFe: ContractName = "MercadoSantaFe";
  const getUserLoanIds = "getUserLoanIds";
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
          <button className="accordion">Section 1</button>
          <div></div>
          <div className="loan-card-header">
            <h2 className="token-card-title"></h2>
          </div>
          <div className="loan-card-content">
            <p className="my-2 font-medium">Balance:</p>
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

          /* Style the buttons that are used to open and close the accordion panel */
          .accordion {
            background-color: #eee;
            color: #444;
            cursor: pointer;
            padding: 18px;
            width: 100%;
            text-align: left;
            border: none;
            outline: none;
            transition: 0.4s;
          }

          /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
          .active,
          .accordion:hover {
            background-color: #ccc;
          }

          /* Style the accordion panel. Note: hidden by default */
          .panel {
            padding: 0 18px;
            background-color: white;
            display: none;
            overflow: hidden;
          }
        `}</style>
      </div>
    </>
  );
};

export default Home;
