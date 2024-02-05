import React,{useState , useEffect} from "react";
import wenb3Modal from "web3modal";
import {ethers} from "ethers";

import { CrowdFundingABI , CrowdFundingAddress } from "./contants";
// import { parse } from "postcss";


const fetchContract = async (signerOrProvider) => 
    new ethers.Contract(CrowdFundingAddress , CrowdFundingABI , signerOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({children}) => {
    const titleData = "Crowd Funding Contract";
    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletConnected = async () => {
        try{
            if (!window.ethereum)
                return setOpenError(true),setError("Install Metamask");

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }else{
                console.log("No Account Found");
            }
        }catch (error) {
            console.log("wrong while connecting to wallet");
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return console.log("install metamask");

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        }catch (error) {
            console.log("error conneting wallet");
        }
    };

    const createCampagin = async (campaign) => {
        try{
            const {title, description, amount, deadline} = campaign;
            const web3Modal = new wenb3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = await fetchContract(signer);

            console.log("createCampagin", contract);
            console.log("CA", currentAccount);
            const transaction = await contract.createCampaign(
                currentAccount,
                title,
                description,
                ethers.utils.parseUnits(amount, 18),
                new Date(deadline).getTime()
            );
            console.log("trans", transaction);
            await transaction.wait();

            console.log("contract call success", transaction);
        }catch (error) {
            console.log("contract call faliure", error);
        }
    };
    const getCampaigns = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            // console.log("pro", provider);
            const contract = await fetchContract(provider);
            // console.log("getCampaigns", contract)
            const campaigns = await contract.getCampaigns();
            console.log("campaigns Data", campaigns);
            if(campaigns.length > 0){
                const parsedCampaigns = campaigns.map((campaign,i) =>({
                    owner: campaign.owner,
                    title: campaign.title,
                    description: campaign.description,
                    target: ethers.utils.formatEther(campaign.target.toString()),
                    deadline: campaign.deadline.toNumber(),
                    amountCollected: ethers.utils.formatEther(
                        campaign.amountCollected.toString()
                        ),
                        pId:i,
                    }));
                    return parsedCampaigns;
                }
    
        } catch (error) {
            console.log("Error while feteching Campaigns", error)
        }
    };

    const  getUserCampaigns = async () =>{
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = await fetchContract(provider);
            // console.log("con", contract);
            const allCampaigns = await contract.getCampaigns();
    
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            const currentUser = accounts[0];
    
            const filteredCampaigns = allCampaigns.filter(
                (campaign) =>
                    campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
            );
    
            const userData = filteredCampaigns.map((campaign,i) =>({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: ethers.utils.formatEther(campaign.target.toString()),
                deadline: campaign.deadline.toNumber(),
                amountCollected: ethers.utils.formatEther(
                    campaign.amountCollected.toString()
                ),
                pId: i,
            }));
    
            return userData;
            
        } catch (error) {
            console.log("Error while getUserCampaigns", error)
        }
    };

    const donate = async (pId, amount) => {
        const web3Modal = new wenb3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        const campaignData = await contract.donateToCampaign(pId, {
            value: ethers.utils.parseEther(amount),
        });

        await campaignData.wait();
        location.reload();

        return campaignData;
    };

    const getDonations = async (pId) => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const donations = await contract.getDonations(pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i=0; i<numberOfDonations;i++){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            });
        }

        return parsedDonations;
    };

    return (
        <CrowdFundingContext.Provider
            value={{
                titleData,
                currentAccount,
                createCampagin,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                connectWallet,
            }}
        >
            {children}
        </CrowdFundingContext.Provider>
    );
};