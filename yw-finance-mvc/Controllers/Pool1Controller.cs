using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using web_mvc.Helpers;
using web_mvc.Options;

namespace web_mvc.Controllers
{
    public class Pool1Controller : Controller
    {
        private readonly Pool1Settings _pool1Settings;

        public Pool1Controller
        (
            IOptions<Pool1Settings> pool1Options
        )
        {
            _pool1Settings = pool1Options.Value;
        }

        public IActionResult Index()
        {
            if (DateTime.UtcNow < DateTimeHelper.UnixTimeStampToDateTime(_pool1Settings.AvailableAt))
            {
                return RedirectToAction("Index", "Home");
            }

            return View();
        }

        public IActionResult StakeForm()
        {
            if (DateTime.UtcNow < DateTimeHelper.UnixTimeStampToDateTime(_pool1Settings.AvailableAt))
            {
                return RedirectToAction("Index", "Home");
            }

            return PartialView("_StakeForm");
        }
    }
}