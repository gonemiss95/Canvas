using System;
using System.Web.Mvc;
using System.Drawing;
using System.IO;

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

        [Route("SaveImage")]
        public JsonResult SaveImage(string imgDataURL)
        {
            string result = "Signature Successfully Save";
            
            if (string.IsNullOrEmpty(imgDataURL) == false)
            {
                string imgStr = string.Empty;

                if (imgDataURL.Substring(11, 4) == "jpeg" || imgDataURL.Substring(11, 4) == "tiff")
                {
                    imgStr = imgDataURL.Remove(0, 23);
                }
                else if (imgDataURL.Substring(11, 3) == "gif" || imgDataURL.Substring(11, 3) == "png")
                {
                    imgStr = imgDataURL.Remove(0, 22);
                }

                try
                {
                    byte[] imgBytes = Convert.FromBase64String(imgStr.Replace(' ', '+'));

                    using (var fs = new FileStream("D:\\Work Document\\result.jpg", FileMode.Create, FileAccess.Write))
                    {
                        fs.Write(imgBytes, 0, imgBytes.Length);
                    }
                }
                catch (Exception)
                {
                    result = "Signature Fail to Save. Please try again.";
                }
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}
