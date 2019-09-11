
/******************************************************************************/
/* File Name   : Encryptor.java                                               */
/* Author      : Yeo Sang Hoon                                                */
/* Date        : 2003/01/30                                                   */
/* Description : Encode/Decode                                                */
/*                                                                            */
/* Modification Log                                                           */
/* Ver No   Date        Author           Modification                         */
/*  1.0.0   2003/01/30  Yeo Sang Hoon    Initial Version                      */
/******************************************************************************/
package com.ecams.common.base;

import java.security.GeneralSecurityException;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import com.ecams.common.logger.EcamsLogger;


public class Encryptor 
{	
	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
  	private static SecretKeySpec secretKeySpec;
	private static String skey = "ecams_secret_pwd";
	//private static String skey = "GISDESKY";
  	
	private static BASE64Encoder encoder;
	private static BASE64Decoder decoder;
  	
	private static Encryptor instance;
  	
  	private Encryptor()
  	{ 
  		encoder = new BASE64Encoder();
  		decoder = new BASE64Decoder();		
  	}    
  	public static Encryptor instance()
  	{
  		if(instance == null)
  		{
  			instance = new Encryptor();	
  		}
  		return instance;
  	}
  	  	  	
  	private SecretKeySpec getSecretKeySpec()
  	{
  		if(secretKeySpec == null)
  		{
			secretKeySpec = new SecretKeySpec(skey.getBytes(), "DES");
  		}
  		return secretKeySpec;
  	}
  	
    /**************************************************************************/
    /* Encode                                                                 */
    /**************************************************************************/
  	public String strGetEncrypt(String str) throws Exception
  	{
		Cipher cipher = Cipher.getInstance("DES");
		cipher.init(Cipher.ENCRYPT_MODE, getSecretKeySpec()); 
		//byte[] encrypted = cipher.doFinal(str.getBytes()); 
		// 2019 06 28 DB프로퍼티 암호화 복호화 제대로 안되어서 수정
		byte[] encrypted = cipher.doFinal(str.getBytes("UTF-8"));
		return encoder.encode(encrypted);  	   		
  	}

	public byte[] byteGetEncrypt(String str) throws Exception
	{
		Cipher cipher = Cipher.getInstance("DES"); 
		cipher.init(Cipher.ENCRYPT_MODE, getSecretKeySpec()); 
		return  cipher.doFinal(str.getBytes());		
	}  	
	
    /**************************************************************************/
    /* Decode                                                                 */
    /**************************************************************************/
	public String strGetDecrypt(String str) throws Exception
	{  		
		byte[] encrypted = decoder.decodeBuffer(str);//str.getBytes();
 
		Cipher cipher = Cipher.getInstance("DES"); 
		cipher.init(Cipher.DECRYPT_MODE, getSecretKeySpec()); 
		byte[] decrypted = cipher.doFinal(encrypted); 
		
		//return new String(decrypted);
		// 2019 06 28 DB프로퍼티 암호화 복호화 제대로 안되어서 수정
		return new String(decrypted,"UTF-8");
	}  	
	
  	public String strGetDecrypt(byte[] encrypted) throws Exception
  	{
		Cipher cipher = Cipher.getInstance("DES"); 
		cipher.init(Cipher.DECRYPT_MODE, getSecretKeySpec()); 
		byte[] decrypted = cipher.doFinal(encrypted); 

		return new String(decrypted);		
  	}
  	
	public String SHA256(String str){
		String SHA = "";
		try{
			MessageDigest sh = MessageDigest.getInstance("SHA-256");
			sh.update(str.getBytes());
			byte byteData[] = sh.digest();
			StringBuffer sb = new StringBuffer();
			
			for(int i = 0 ; i < byteData.length ; i++){
				sb.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
			}
			SHA = sb.toString();
		}catch(NoSuchAlgorithmException e){
			e.printStackTrace();
			SHA = null;
		}
		return SHA;
	}

  	public String strGetEncrypt_AES(String str) throws Exception
  	{
  		try {
	  		//https://offbyone.tistory.com/286
	  		byte[] secretKey = skey.getBytes();
	        byte[] iv = skey.getBytes();
	            	  
		    SecretKey key = new SecretKeySpec(secretKey, "AES");
		    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		    IvParameterSpec ivSpec = new IvParameterSpec(iv);
		    cipher.init(Cipher.ENCRYPT_MODE, key, ivSpec);
		    
		    byte[] results = cipher.doFinal(str.getBytes());
	        BASE64Encoder encoder = new BASE64Encoder();
	
	        return encoder.encode(results);
  		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Encryptor.strGetEncrypt_AES256() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Encryptor.strGetEncrypt_AES256() Exception END ##");
			throw exception;
		}finally{
		}
  	}
  	public String strGetEncrypt_AES256(String str) throws NoSuchAlgorithmException,GeneralSecurityException,UnsupportedEncodingException
  	{
		String iv;
		Key keySpec;
		
		iv = skey.substring(0,16);
  		byte[] keyBytes = new byte[16];
  		byte[] b = skey.getBytes("UTF-8");
  		int len = b.length;
  		if (len > keyBytes.length) {
  			len = keyBytes.length;
  		}
  		System.arraycopy(b,0,keyBytes,0,len);
  		SecretKey key = new SecretKeySpec(keyBytes, "AES");
  		
  		keySpec = key;
  		
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, keySpec, new IvParameterSpec(iv.getBytes()));
		byte[] encrypted = cipher.doFinal(str.getBytes("UTF-8"));
		String enStr = new String(Base64.encodeBase64(encrypted));  			

        return enStr;
  	}
  	public String strGetDecrypt_AES(String str) throws Exception
	{  		

        byte[] secretKey = skey.getBytes();
        byte[] iv = skey.getBytes();
        
        SecretKey key = new SecretKeySpec(secretKey, "AES");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(iv));
        
        byte[] decrypted = cipher.doFinal(new BigInteger(str, 16).toByteArray());
        
        return new String(decrypted);
	}  
	public String strGetDecrypt_AES256(String str) throws NoSuchAlgorithmException,GeneralSecurityException,UnsupportedEncodingException
	{  		
		String iv;
		Key keySpec;
		
		iv = skey.substring(0,16);
  		byte[] keyBytes = new byte[16];
  		byte[] b = skey.getBytes("UTF-8");
  		int len = b.length;
  		if (len > keyBytes.length) {
  			len = keyBytes.length;
  		}
  		System.arraycopy(b,0,keyBytes,0,len);
  		SecretKey key = new SecretKeySpec(keyBytes, "AES");
  		
  		keySpec = key;
  		
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(iv.getBytes()));
		byte[] byteStr = Base64.decodeBase64(str.getBytes());			

        return new String(cipher.doFinal(byteStr),"UTF-8");
	} 	
  	public static void main(String[] args)
  	{
  		try
  		{
  			String password = "HTML5";
  			
  			String en = Encryptor.instance().strGetEncrypt(password);  			
  			
			String de = Encryptor.instance().strGetDecrypt(en);
  			
			String sha = Encryptor.instance().SHA256(password);
			
			System.out.println(password);
			System.out.println(en);
  			System.out.println(de);
  			System.out.println(sha);
  			
  		}catch(Exception e)
  		{}
  	}
}
