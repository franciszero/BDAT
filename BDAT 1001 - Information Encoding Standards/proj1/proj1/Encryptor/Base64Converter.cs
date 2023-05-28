using System;
using System.Text;

namespace Assign1_DataSecurity_Encoding.Models
{
    public class Base64Converter
    {
        private char[] table = new char[64] {
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            '0','1','2','3','4','5','6','7','8','9','+','/'};

        public Base64Converter() { }

        private string char3tob64(int v)
        {
            return $"{table[(v & 0b_00000000_11111100_00000000_00000000) >> 18]}" +
                $"{table[(v & 0b_00000000_00000011_11110000_00000000) >> 12]}" +
                $"{table[(v & 0b_00000000_00000000_00001111_11000000) >> 6]}" +
                $"{table[v & 0b_00000000_00000000_00000000_00111111]}";
        }

        public string str2b64V2(string str)
        {
            StringBuilder sb = new StringBuilder();
            int i;
            for (i = 0; i < str.Length / 3 * 3; i += 3)
            {
                sb.Append(char3tob64((str[i] << 16) + (str[i + 1] << 8) + str[i + 2]));
            }

            int v = 0;
            if (i < str.Length)
            {
                v += str[i] << 16;

                if (i + 1 < str.Length)
                {
                    v += str[i + 1] << 8;
                }
                if (i + 2 < str.Length)
                {
                    v += str[i + 2];
                }
                sb.Append(char3tob64(v));
                int x = str.Length - i;
                for (i = 1; i <= 3 - x; i++)
                {
                    sb[sb.Length - i] = '=';
                }
            }
            return sb.ToString();
        }

        public string str2b64(string str)
        {
            return Convert.ToBase64String(Encoding.ASCII.GetBytes(str));
        }

        public string b642str(string str)
        {
            return Encoding.ASCII.GetString(Convert.FromBase64String(str));
        }
    }
}

