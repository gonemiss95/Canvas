using System;
using System.Web.Mvc;
using System.Drawing;

namespace Canvas.Controllers
{
    [RoutePrefix("Home")]
    public class HomeController : Controller
    {
        [Route("Index")]
        public ActionResult Index()
        {
            return View();
        }

        [Route("Scan")]
        public ActionResult Scan()
        {
            return View();
        }

        [Route("Edit")]
        public ActionResult Edit()
        {
            return View();
        }

        [Route("GetImage")]
        public JsonResult GetImage()
        {
            Image img = Image.FromFile("D:\\Work Document\\a.jpg");
            ImageConverter imgConverter = new ImageConverter();
            byte[] imgBytes = imgConverter.ConvertTo(img, typeof(byte[])) as byte[];
            string imgStr = $"data:image/gif;base64,{Convert.ToBase64String(imgBytes)}";
            return Json(imgStr, JsonRequestBehavior.AllowGet);
        }
    }
}
