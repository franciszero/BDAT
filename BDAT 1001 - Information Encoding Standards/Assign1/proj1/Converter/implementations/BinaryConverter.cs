using System.Text;

namespace Assign1_DataSecurity_Encoding.Models
{
    public class BinaryConverter : BaseConverter
    {
        public BinaryConverter(string name) : base(name, 2) { }

        public override string str2bin()
        {
            byte[] arr = Encoding.ASCII.GetBytes(name);
            string buf = "";
            foreach (char b in arr)
            {
                // .NET framework method
                //buf += char2strbin(b);

                // self define implementation
                for (int i = 7; i >= 0; i--)
                {
                    buf += $"{(b >> i) & 0x01}";
                }
            }

            return buf;
        }

        public override string bin2str(string encoding_str)
        {
            int len = encoding_str.Length / _pad;
            string buf = "";
            for (int i = 0; i < len; i++)
            {
                string str = encoding_str.Substring(i * _pad, _pad);
                //// in build method
                //buf += strbin2char(str);

                // self define implementation
                int c = 0;
                for (int j = 0; j < 8; j++)
                {
                    Console.Write($"Processing str[{j}] = {str.Substring(j, 1)}");
                    if (str.Substring(j, 1) == "1")
                    {
                        int tmp = (int)Math.Pow(2, 7 - j);
                        Console.Write($"\t{tmp}");
                        c += tmp;
                    }
                    Console.WriteLine("");
                }
                Console.WriteLine($"Result               \t{c}={(char)c}\n");
                buf += (char)c;
            }
            return buf;
        }
    }
}

