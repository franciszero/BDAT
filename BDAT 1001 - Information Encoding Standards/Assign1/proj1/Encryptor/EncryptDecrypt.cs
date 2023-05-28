using System;
using System.Text;
namespace Assign1_DataSecurity_Encoding.Models
{
    public class EncryptDecrypt
    {
        private string key = "This is a key!";

        public EncryptDecrypt() { }

        public string encryption(string str)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < str.Length; i++)
            {
                int j = i % this.key.Length;
                var v = $"{str[i] ^ this.key[j]:D2}";
                Console.WriteLine($"{str[i]}^{this.key[j]}={v}");
                sb.Append(v);
            }
            return sb.ToString();
        }

        public string decryption(string str)
        {
            StringBuilder sb = new StringBuilder();
            int len = str.Length / 2;
            for (int i = 0; i < len; i++)
            {
                string substr = str.Substring(i * 2, 2);
                int j = i % this.key.Length;
                char v = (char) (Convert.ToInt32(substr) ^ this.key[j]);
                Console.WriteLine($"0x{substr} ^ {this.key[j]} = {v}");
                sb.Append(v);
            }
            return sb.ToString();
        }
    }
}

