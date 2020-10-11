const pool1MinTransactionGasLimit = 100000;
const pool1MidTransactionGasLimit = 400000;
const pool1MaxTransactionGasLimit = 2000000;
const unitEther = "ether";
const unitGwei = "gwei";

/**
 * Make staking to the pool1
 * @param {any} amount
 * @param {any} referredBy
 */
const pool1OnStake = async (amount, referredBy) => {
  $("#btnStake").attr("aria-disabled", true);
  // Pool information
  const pool1Contract = await getPoolContract(window.pool1.contractAddress, pool1ABI);
  // Get list of accounts of the connected wallet
  const fromAccount = window.web3.currentProvider.selectedAddress
    ? window.web3.currentProvider.selectedAddress
    : window.web3.currentProvider.accounts[0];
  let processContent = "";
  // Approve
  const stakeContract = await getERC20Contract(window.pool1.stakeToken.contractAddress);
  //const valueBN = web3.utils.toBN(amount);
  const valueBN = window.BigNumber(amount);
  //const decimalsBN = web3.utils.toBN(window.pool1.stakeToken.decimals);
  const decimalsBN = window.BigNumber(window.pool1.stakeToken.decimals);
  //const valueToSend = valueBN.mul(web3.utils.toBN(10).pow(decimalsBN));
  const valueToSend = valueBN.times(window.BigNumber(10).pow(decimalsBN));
  const gasPrice = web3.utils.toWei(`${window.currentGasPrice.proposeGasPrice}`, unitGwei);
  const transactionFee = window.pool1.transactionFee > 0
    ? web3.utils.toWei(`${window.pool1.transactionFee}`, unitEther)
    : 0;

  $(".processingArea").css("visibility", "inherit");
  stakeContract.methods.approve(window.pool1.contractAddress, web3.utils.toBN(valueToSend))
    .send({
      from: fromAccount,
      gasPrice: gasPrice
    })
    .on("transactionHash",
      function(hash) {
        processContent = `Approval of ${amount} ${window.pool1.stakeToken.symbol} is confirming ...`;
        $(".message").html(processContent);
      }).on("receipt",
      function(receipt) {
        processContent =
          `Please confirm your request to stake ${amount} ${window.pool1.stakeToken.symbol} into Pool ...`;
        $(".message")
          .html(processContent);
        pool1Contract.methods.stake(web3.utils.toBN(valueToSend))
          .send({
            from: fromAccount,
            gasPrice: gasPrice,
            value: transactionFee
          })
          .on("transactionHash",
            function(hash) {
              processContent = "Your stake request is confirming ...";
              $(".message")
                .html(processContent);
            })
          .on("receipt",
            function(receipt) {
              processContent =
                "Your request is processed. Browser will be refreshed after 3s to get latest information.";
              $(".message")
                .html(processContent);

              // Refresh
              pageRefresh(3000);
            })
          .on("error",
            function(error, receipt) {
              $(".message")
                .html(`${error.message}`);

              // Refresh
              pageRefresh(1500);
            });
      })
    .on("error",
      function(error, receipt) {
        console.log(error);
        $(".message").html(`${error.message}`);
        pageRefresh(1500);
      });
};

/**
 * Claim pool rewards
 */
const pool1OnRewardsClaim = async () => {
  // Pool information
  const pool1Contract = await getPoolContract(window.pool1.contractAddress, pool1ABI);
  // Get list of accounts of the connected wallet
  const fromAccount = window.web3.currentProvider.selectedAddress
    ? window.web3.currentProvider.selectedAddress
    : window.web3.currentProvider.accounts[0];
  const gasPrice = web3.utils.toWei(`${window.currentGasPrice.proposeGasPrice}`, unitGwei);
  const transactionFee = window.pool1.transactionFee > 0
    ? web3.utils.toWei(`${window.pool1.transactionFee}`, unitEther)
    : 0;
  let processContent = "";
  pool1Contract.methods.rewardOf(fromAccount)
    .call()
    .then(function(result) {
      if (result <= 0) {
        alert("You do not have any rewards to claim.");
        return;
      }

      $(".processingArea").css("visibility", "inherit");
      processContent =
        "Please confirm reward claim transaction ...";
      $(".message").html(processContent);
      pool1Contract.methods.claimReward()
        .send({
          from: fromAccount,
          gasPrice: gasPrice,
          value: transactionFee
        })
        .on("transactionHash",
          function(hash) {
            processContent =
              "Your reward claim request is processing ...";
            $(".message")
              .html(processContent);
          })
        .on("receipt",
          function(receipt) {
            processContent =
              "Your reward claim request is processed successful ...";
            $(".message")
              .html(processContent);
            // Refresh
            pageRefresh(3000);
          })
        .on("error",
          function(error, receipt) {
            $(".message")
              .html(`${error.message}`);
            // Refresh
            pageRefresh(3000);
          });
    });
};

/**
 * Unstake and claim all available rewards
 */
const pool1OnUnstakeAndClaimRewards = async () => {
  // Pool information
  const pool1Contract = await getPoolContract(window.pool1.contractAddress, pool1ABI);
  // Get list of accounts of the connected wallet
  const fromAccount = window.web3.currentProvider.selectedAddress
    ? window.web3.currentProvider.selectedAddress
    : window.web3.currentProvider.accounts[0];
  const gasPrice = web3.utils.toWei(`${window.currentGasPrice.proposeGasPrice}`, unitGwei);
  const transactionFee = window.pool1.transactionFee > 0
    ? web3.utils.toWei(`${window.pool1.transactionFee}`, unitEther)
    : 0;
  let processContent = "";
  pool1Contract.methods.isStakeholder(fromAccount)
    .call()
    .then(function(result) {
      if (result.exists_) {
        $(".processingArea").css("visibility", "inherit");
        processContent =
          "Please confirm unstake & claim reward transaction ...";
        $(".message")
          .html(processContent);

        pool1Contract.methods.unstakeAndClaimReward()
          .send({
            from: fromAccount,
            gasPrice: gasPrice,
            value: transactionFee
          })
          .on("transactionHash",
            function(hash) {
              processContent =
                "Your unstake & claim rewards request is processing ...";
              $(".message")
                .html(processContent);
            })
          .on("receipt",
            function(receipt) {
              processContent =
                "Your unstake & claim rewards request is processed successful ...";
              $(".message")
                .html(processContent);
              // Refresh
              pageRefresh(3000);
            })
          .on("error",
            function(error, receipt) {
              processContent =
                "Sorry we can not process your request. Please try again.";
              $(".message")
                .html(processContent);
              // Refresh
              pageRefresh(3000);
            });;
      } else {
        alert("You are not stakeholder of this pool.");
      }
    });
};

/**
 * Unstake and claim all available rewards
 */
const pool1OnWithdraw = async () => {
  // Pool information
  const pool1Contract = await getPoolContract(window.pool1.contractAddress, pool1ABI);
  // Get list of accounts of the connected wallet
  const fromAccount = window.web3.currentProvider.selectedAddress
    ? window.web3.currentProvider.selectedAddress
    : window.web3.currentProvider.accounts[0];
  const gasPrice = web3.utils.toWei(`${window.currentGasPrice.proposeGasPrice}`, unitGwei);
  const transactionFee = window.pool1.transactionFee > 0
    ? web3.utils.toWei(`${window.pool1.transactionFee}`, unitEther)
    : 0;
  let processContent = "";
  pool1Contract.methods.isStakeholder(fromAccount)
    .call()
    .then(function(result) {
      if (result.exists_) {
        $(".processingArea").css("visibility", "inherit");
        processContent =
          "Please confirm withdraw transaction ...";
        $(".message")
          .html(processContent);

        pool1Contract.methods.withdrawAndClaimReward()
          .send({
            from: fromAccount,
            gasPrice: gasPrice,
            value: transactionFee
          })
          .on("transactionHash",
            function(hash) {
              processContent =
                "Your withdraw request is processing ...";
              $(".message")
                .html(processContent);
            })
          .on("receipt",
            function(receipt) {
              processContent =
                "Your withdraw request is processed successful ...";
              $(".message")
                .html(processContent);
              // Refresh
              pageRefresh(3000);
            })
          .on("error",
            function(error, receipt) {
              processContent =
                "Sorry we can not process your request. Please try again.";
              $(".message")
                .html(processContent);
              // Refresh
              pageRefresh(3000);
            });;
      } else {
        alert("You are not stakeholder of this pool.");
      }
    });
};

/**
 * Get pool1 information
 */
const getPoolInformation = async() => {
  const pool1Contract = await getPoolContract(window.pool1.contractAddress, pool1ABI);
  pool1Contract.methods.getPoolInformation()
    .call()
    .then(function(result) {
      displayPool1Information(result);
    });
};

/**
 * Get stakeholder staking information
 */
const myPoolInformation = async() => {
  const pool1Contract = await getPoolContract(window.pool1.contractAddress, pool1ABI);
  // Get list of accounts of the connected wallet
  const fromAccount = window.web3.currentProvider.selectedAddress
    ? window.web3.currentProvider.selectedAddress
    : window.web3.currentProvider.accounts[0];
  pool1Contract.methods.myPoolInformation()
    .call({
      from: fromAccount
    }).then(function(response) {
      displayMyPool1Information(response);
    }).catch((err) => {
      console.log(err);
    });
};

function waitForWalletConnectThenFetchInformation() {
  if (typeof selectedAccount !== "undefined") {
    myPoolInformation();
  } else {
    setTimeout(waitForWalletConnectThenFetchInformation, 250);
  }
}