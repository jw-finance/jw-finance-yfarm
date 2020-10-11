using System.Numerics;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;

namespace web_mvc.Services.SmartContracts.GenericFunctions
{
    [Function("getPoolInformation")]
    public class GetPoolInformationFunction : FunctionMessage
    {
    }

    [FunctionOutput]
    public class GetPoolInformationOutputDto : IFunctionOutputDTO
    {
        [Parameter("uint256", "lastRewardDistributionOn_", 1)]
        public virtual BigInteger LastRewardDistributionOn { get; set; }

        [Parameter("uint256", "poolTotalReward_", 2)]
        public virtual BigInteger PoolTotalReward { get; set; }

        [Parameter("uint256", "poolRemainingReward_", 3)]
        public virtual BigInteger PoolRemainingReward { get; set; }

        [Parameter("uint256", "poolDistributedReward_", 4)]
        public virtual BigInteger PoolDistributedReward { get; set; }

        [Parameter("uint256", "poolClaimedReward_", 5)]
        public virtual BigInteger PoolClaimedReward { get; set; }

        [Parameter("uint256", "poolNextHalvingAt_", 6)]
        public virtual BigInteger PoolNextHalvingAt { get; set; }

        [Parameter("uint256", "poolNumberOfStakeholders_", 7)]
        public virtual BigInteger PoolNumberOfStakeholders { get; set; }

        [Parameter("uint256", "poolTotalStake_", 8)]
        public virtual BigInteger PoolTotalStake { get; set; }

        [Parameter("uint256", "poolInitialRewards_", 9)]
        public virtual BigInteger PoolInitialRewards { get; set; }
    }
}