using System;
using System.Text;
using Assign1_DataSecurity_Encoding.Models;

// read name from Stdin
Console.WriteLine("\n============ Task 1 ============");
string name = new ReceiveName().name;

// convert string name to string binary
Console.WriteLine("\n============ Task 2 ============");
var bin_conv = new BinaryConverter(name);

var encoding_name = bin_conv.str2bin();  // convert string name to string binary
Console.WriteLine($"String binary of name \"{name}\" is {encoding_name}");

var decoding_name = bin_conv.bin2str(encoding_name); // convert string binary to string name
Console.WriteLine($"decoded name from binary string: \"{decoding_name}\"");

// hex converter
Console.WriteLine("\n============ Task 3 ============");
var hex_conv = new HexadecimalConverter(name);

encoding_name = hex_conv.str2bin();  // convert string name to string binary
Console.WriteLine($"String hex of name \"{name}\" is {encoding_name}");

decoding_name = hex_conv.bin2str(encoding_name); // convert string binary to string name
Console.WriteLine($"decoded name from hex string: \"{decoding_name}\"");

// task 4
Console.WriteLine("\n============ Task 4 ============");
var b64conv = new Base64Converter();
var b64name = b64conv.str2b64V2(name);
Console.WriteLine($"Base64 encryption of name \"{name}\" is {b64name}");

// task 5
Console.WriteLine("\n============ Task 5 ============");
var ende = new EncryptDecrypt();
string en_name = ende.encryption(name);
Console.WriteLine($"name encryption: {en_name}");
string de_name = ende.decryption(en_name);
Console.WriteLine($"name decryption: {de_name}");

// press enter to end debugging
Console.WriteLine("\n============ Tasks completed ============");
Console.ReadKey();
