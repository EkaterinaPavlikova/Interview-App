using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using jsFirstTask.Models;
using jsFirstTask.Services;
using Microsoft.AspNetCore.Mvc;


namespace jsFirstTask.Controllers
{
    public class HomeController : Controller
    {     
        public IActionResult Index() => View();
        
        public string Error()  => "Error";
      
    }
}
