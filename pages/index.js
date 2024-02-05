import React , {useEffect, useContext , useState} from 'react';

import {CrowdFundingContext} from "../Context/CrowdFunding";
import {Hero , Card , PopUp} from "../Components";

const index = () => {
  const {
    titleData,
    getCampaigns,
    createCampagin,
    donate,
    getUserCampaigns,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allcampaign , setAllcampaign] = useState();
  const [usercampaign , setUsercampaign] = useState();

  useEffect(() => {
    const getCampaignsData = getCampaigns();
    const userCampaignsData = getUserCampaigns();
    return async () =>{
      const allData = await getCampaignsData;
      const userData = await userCampaignsData;
      setAllcampaign(allData);
      setUsercampaign(userData);
    };
  }, []);

  //Donate popup model
  const [openModel,setOpenModel] = useState(false);
  const [donateCampaign,setDonateCampaign] = useState();

  console.log(donateCampaign);
  return (
    <>
      <Hero titleData = {titleData} createCampaign={createCampagin} />
      {/* <Hero titleData = {titleData} /> */}

      <Card
        title = "All Listed Campaigns"
        allcampaign={allcampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />
      <Card
        title="Your Created Campaign"
        allcampaign={usercampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />

      {openModel && (
        <PopUp
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  );
};


// const index = () => {
//   return <h1>hello world</h1>
// };

export default index;