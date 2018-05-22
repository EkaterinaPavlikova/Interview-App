
using jsFirstTask.Infrastructure;
using jsFirstTask.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace jsFirstTask.Services
{
    public class SessionTestService: TestService
    {
        [JsonIgnore]
        public ISession Session { get; set; }
          
        
        public static TestService GetTestService(IServiceProvider services)
        {
            ISession session = services.GetRequiredService<IHttpContextAccessor>()?.HttpContext.Session;
            SessionTestService test = session?.GetJson<SessionTestService>("TestService") ?? new SessionTestService();
            test.Session = session;
            return test;
        }

        public override void SetQuestions(IEnumerable<QuestionEntity> questions)
        {
           base.SetQuestions(questions);
           Session.SetJson("TestService", this);
        }
    }
}
