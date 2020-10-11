const displayPool1Information = (result) => {
  const selectedAccount = window.web3.currentProvider.selectedAddress
    ? window.web3.currentProvider.selectedAddress
    : window.web3.currentProvider.accounts[0];
  const poolTotalStake =
    `${window.numeral(result.poolTotalStake_ / (10 ** window.pool1.stakeToken.decimals)).format("0,0")} ${window
      .pool1
      .stakeToken
      .symbol}`;
  $(".poolTotalStake_").html(poolTotalStake);

  const poolTotalReward =
    `${window.numeral(result.poolTotalReward_ / (10 ** window.pool1.rewardToken.decimals)).format("0,0")} ${window
      .pool1
      .rewardToken
      .symbol}`;
  $(".poolTotalReward_").html(poolTotalReward);

  const poolRewardPerSecond =
    `${window.numeral(result.poolRewardPerSecond_ / (10 ** window.pool1.rewardToken.decimals))
      .format("0,0.000000")} ${window
      .pool1
      .rewardToken
      .symbol}`;
  $(".poolRewardPerSecond_").html(poolRewardPerSecond);

  //const poolNumberOfStakeholders =
  //    `${window.numeral(result.poolNumberOfStakeholders_).format("0,0")} Addresses`;
  // $(".poolNumberOfStakeholders_").html(poolNumberOfStakeholders);

  const poolClaimedReward =
    `${window.numeral(result.poolClaimedReward_ / (10 ** window.pool1.rewardToken.decimals)).format("0,0.000000")} ${window
      .pool1
      .rewardToken
      .symbol}`;

  $(".poolClaimedReward_").html(poolClaimedReward);

  const poolEndedAt = window.moment.unix(result.poolEndedAt_).format("YYYY/MM/DD HH:mm");
  $(".poolEndedAt_").html(`${poolEndedAt}`);

  if (window.moment().isAfter(window.moment.unix(result.poolStartedAt_)) &&
    window.moment().isBefore(window.moment.unix(result.poolEndedAt_))) {
    $(".stake").removeAttr("disabled");
  }

  $(".connectedWallet").html(`Wallet [${selectedAccount}]`);
};

const displayMyPool1Information = (result) => {
  // My stake
  if (result.address_ === "0x0000000000000000000000000000000000000000") {
    $(".stakeAmount_").html("_");
    $(".createdAt_").html("_");
    $(".canUnlockWithdrawAt").html("_");
    $(".reward_").html("_");
    $(".claimedReward_").html("_");
  } else {
    const stakeAmountContent =
      `${window.numeral(result.stakeAmount_ / (10 ** window.pool1.stakeToken.decimals)).format("0,0")} ${window
        .pool1
        .stakeToken
        .symbol}`;

    $(".stakeAmount_").html(stakeAmountContent);
    $(".createdAt_").html(window.moment.unix(result.createdAt_).format("YYYY/MM/DD HH:mm"));
    $(".canUnlockWithdrawAt").html(window.moment.unix(result.canUnlockWithdrawAt).format("YYYY/MM/DD HH:mm"));

    const rewardContent =
      `${window.numeral(result.reward_ / (10 ** window.pool1.rewardToken.decimals)).format("0,0.000000")} ${window
        .pool1
        .rewardToken
        .symbol}`;
    $(".reward_").html(rewardContent);

    const claimedRewardContent =
      `${window.numeral(result.claimedReward_ / (10 ** window.pool1.rewardToken.decimals)).format("0,0.000000")} ${window
        .pool1
        .rewardToken
        .symbol}`;
    $(".claimedReward_").html(claimedRewardContent);

    // Actions control
    if (result.reward_ > 0) {
      $(".claim").removeAttr("disabled");
    }

    if (result.expiredAt_ === "0" && result.address_ !== "0x0000000000000000000000000000000000000000") {
      $(".unstake").removeAttr("disabled");

      if (result.reward_ > 0) {
        $(".unstakeAndClaim").removeAttr("disabled");
      }
    }

    if (window.moment().isAfter(window.moment.unix(result.canUnlockWithdrawAt)) && result.stakeAmount_ > 0) {
      $(".withdraw").removeAttr("disabled");
    }
  }
};

const fetchBalance = async (address) => {
  const stakeContract = await getERC20Contract(window.pool1.stakeToken.contractAddress);
  stakeContract.methods.balanceOf(address)
    .call()
    .then(function(result) {
      const decimalsBN = web3.utils.toBN(window.pool1.stakeToken.decimals);
      const balance = web3.utils.toBN(result);
      const value = balance.div(web3.utils.toBN(10).pow(decimalsBN));
      $(".balance")
        .html(`Your available balance ${window.numeral(value).format("0,0")} ${window.pool1.stakeToken
          .symbol}`);
      $("#balance").val(value);
    })
    .catch(function(err) {
      console.log(err);
    });
};

const setQuickAmount = (percent) => {
  const availableBalance = $("#balance").val();
  $("#amount").val((percent * availableBalance) / 100);
};

const showContentModal = (id) => {
  $(`#${id}`).modal({
    backdrop: "static",
    keyboard: false
  });
};