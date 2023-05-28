using System;
namespace Assign1_DataSecurity_Encoding.Models
{
    public abstract class BaseConverter
    {
        protected string name = "";
        protected int _base = 2;
        protected int _pad = 2;
        protected uint[] _arr = new uint[8] { 1, 2, 4, 8, 16, 32, 64, 128};

        private BaseConverter() { }

        public BaseConverter(string name, int _base)
        {
            this.name = name;
            this._base = _base;
            if (this._base == 2)
            {
                this._pad = 8;
            }
            else if (this._base == 8)
            {
                this._pad = 3;
            }
            else if (this._base == 16)
            {
                this._pad = 2;
            } else
            {
                this._pad = 0;
            }
        }

        public abstract string str2bin();
        public abstract string bin2str(string encoding_str);

        protected string char2strbin(char c)
        {
            return Convert.ToString(c, toBase: _base).PadLeft(_pad, '0');
        }

        protected char strbin2char(string s)
        {
            return Convert.ToChar(Convert.ToByte(s, this._base));
        }
    }
}

