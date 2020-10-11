namespace web_mvc.Options
{
    public class AppSettings
    {
        public string Domain { get; set; }
        public string Facebook { get; set; }
        public string Github { get; set; }
        public string Telegram { get; set; }
        public Copyright Copyright { get; set; }
    }

    public class Copyright
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public int Year { get; set; }
    }
}