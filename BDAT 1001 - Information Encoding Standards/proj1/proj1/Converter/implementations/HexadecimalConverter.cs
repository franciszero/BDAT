using System;
using System.Text;

namespace Assign1_DataSecurity_Encoding.Models
{
    public class HexadecimalConverter : BaseConverter
    {
        public HexadecimalConverter(string name) : base(name, 16) { }

        public override string str2bin()
        {
            byte[] arr = Encoding.ASCII.GetBytes(name);
            string buf = "";

            //// .NET framework method
            //foreach (char c in arr)
            //{
            //    buf += char2strbin(c);
            //}

            // self define implementation
            foreach (char c in arr)
            {
                buf += $"{(c >> 4) & 0x0F:x}"; // high 4 bit
                buf += $"{c & 0x0F:x}"; // low 4 bit
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
                // .NET framework method
                ////buf += strbin2char(str);

                // self define implementation
                var v = (char)Convert.ToInt32($"0x{str}", 16);
                Console.WriteLine($"Processing 0x{str} = {(int)v,3} = {v}");

                buf += v;
            }
            return buf;
        }
    }
}

