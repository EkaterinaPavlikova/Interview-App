using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using jsFirstTask.Models;
using jsFirstTask.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace jsFirstTask.Controllers
{
    [Produces("application/json")]
    [Route("api/TestService")]
    public class TestServiceController : Controller, ITestService
    {
        private TestService testService;
        private ApplicationContext dbContext;

        public TestServiceController(ApplicationContext context, TestService service )
        {
            dbContext = context;
            testService = service;
        }


        [HttpPost("[action]")]
        //[HttpGet("GetNext/{index}")]
        public QuestionEntity GetNext([FromBody]int index)
        {
            return testService.GetQuestion(index);
        }

        [HttpGet("[action]")] 
        public int TestInit()
        {
            int allQuestionsNumber = dbContext.QuestionEntities.Count();

            if (allQuestionsNumber > 0)
            {          
               // Random rnd = new Random();
                int N = 5;//rnd.Next(1, allQuestionsNumber + 1);
             
                var questions = dbContext.QuestionEntities.OrderBy(q => Guid.NewGuid()).Take(N);
                testService.SetQuestions(questions);
            }
         
            return testService.GetQuestionsCount();
        }
    }
}