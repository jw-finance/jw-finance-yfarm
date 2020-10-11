namespace web_mvc.Options
{
    public class Pool1Settings
    {
        public string Name { get; set; }
        public string ContractAddress { get; set; }
        public string Abi { get; set; }
        public decimal TransactionFee { get; set; }
        public double AvailableAt { get; set; }
        public double PoolDurationHours { get; set; }
        public double PoolReward { get; set; }
        public Erc20TokenSettings RewardContract { get; set; }
        public Erc20TokenSettings StakeContract { get; set; }
    }
}