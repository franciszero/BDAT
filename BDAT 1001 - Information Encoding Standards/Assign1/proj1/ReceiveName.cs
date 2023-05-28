using System;
namespace Assign1_DataSecurity_Encoding.Models
{
    public class ReceiveName
	{
        public string name = "";

		public ReceiveName()
		{
            Console.Write("Enter your name => ");
            name = Console.ReadLine();
            Console.WriteLine("Your name is :" + name);
        }
	}
}

