const handleButtonClick = () => {
  callForm();
  if (window.innerWidth >= 1024) {
    window.scrollTo({
      top: 5400,
    });
  }
};

<button className="button-pulse" onClick={handleButtonClick}>
  botão
</button>;
