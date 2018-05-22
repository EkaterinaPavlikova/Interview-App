using jsFirstTask.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace jsFirstTask.Services
{
    public interface ITestService
    {
        int TestInit();
        QuestionEntity GetNext(int index);
    }
}
