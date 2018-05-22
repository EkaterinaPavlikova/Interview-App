using jsFirstTask.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace jsFirstTask.Services
{
    public class TestService
    {

        public List<QuestionEntity> Questions = new List<QuestionEntity>();

        public QuestionEntity GetQuestion(int index)
        {
            return index <= Questions.Count ? Questions[index] : null;
        }

        public int GetQuestionsCount()
        {
            return Questions.Count;
        }

        public virtual void SetQuestions(IEnumerable<QuestionEntity> questions)
        {
            Questions.Clear();
            Questions.AddRange(questions);
        }

    }

}
