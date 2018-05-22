using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace jsFirstTask.Models
{
    public class ApplicationContext :DbContext
    {
        public DbSet<QuestionEntity> QuestionEntities { get; set; }
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            
        }
    }
}
