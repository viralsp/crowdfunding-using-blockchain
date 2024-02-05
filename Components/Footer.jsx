import React from 'react'

const Footer = () => {
  const productList = ["Market" , "ERC20 Token" , "Donation"];
  const contactList = [
    "spatel2206@gmail.com",
    "viralspatel1112@gmail.com",
    "contact us",

  ];
  const usefullLink = ["Home", "About us", "Company bio"];
  return (
    <footer class ="text-center text-white backgroundMain lg:text-left">
      <div class="mx-6 py-10 text-center md:text-left">
        <div class="grid-1 grid gap-8 md:text-left">
          <div class="">
            <h6 class="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Crowd Funding
            </h6>
            <p></p>
          </div>
          <div class="">
            <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Products
            </h6>
            {productList.map((el,i) => (
              <p class="mb-4" key={i + 1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>
          <div class="">
            <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Useful links
            </h6>
            {usefullLink.map((el,i) => (
              <p class="mb-4" key={i + 1}>
                <a href='#!'>{el}</a>
              </p>
            ))}
          </div>
          <div>
            <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Contact
            </h6>
            {contactList.map((el,i) => (
              <p class="mb-4" key={i + 1}>
                <a href='#!'>{el}</a>
              </p>
            ))}
          </div>
        </div>
      </div>
      <div class="backgroundMain p-6 text-center">
        <span>2023</span>
        <a class ="font-semibold" href='https://tailwind-elements.com/'>
          Crowd Funding
        </a>
      </div>
    </footer>
  );
};

export default Footer
