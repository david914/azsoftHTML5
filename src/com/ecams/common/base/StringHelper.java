
/******************************************************************************
   ������Ʈ��    : ������� �ý���
   ����ý��۸�  : String ���� UTIL CLASS
   ���ϸ�       : StringHelper.java      
   ��������
   ������         �����       ��������
-------------------------------------------------------------------------------
  2006. 08. 08.  TEOK.KANG     ���ʻ���
******************************************************************************/


package com.ecams.common.base;


/**
 * @author bigeyes
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class StringHelper{
	
	/**
	 * @param param
	 * @param param2
	 * @return
	 */
	public static String nvl(String param, String param2){
	        return param != null ? param : param2;
	}//end of nvl method() statement
	
	/**
	 * @param param
	 * @param param2
	 * @return
	 */
	public static String evl(String param, String param2){
        return param != null && !param.trim().equals("") ? param : param2;
    }//end of evl method() statement
	
	/**
	 * @param s
	 * @return
	 */
	public static String toAsc(String s)
	{
		if(s == null)
			return null;
		try
		{
			return new String(s.getBytes("KSC5601"), "8859_1");
		}
		catch(Exception exception)
		{
			return s;
		}
	}//end of toAsc method() statement
	
	/**
	 * @param s
	 * @return
	 */
	public static String toKsc(String s)
	{
		if(s == null)
			return null;
		try
		{
			return new String(s.getBytes("8859_1"), "KSC5601");
		}
		catch(Exception exception)
		{
			return s;
		}
	}//end of toKsc method() statement
	
	/**
	 * ���ڿ��� ������ �����ϰ� ��ȯ�Ѵ�.
	 * @param s
	 * @return
	 */
	public static String deleteWhiteSpace(String s){
		if (s == null)
			return null;
		int sz                 = s.length();
		StringBuffer strbuffer = new StringBuffer(sz); 
		
		for (int i = 0; i < sz; i++){
			if (!Character.isWhitespace(s.charAt(i))){
				strbuffer.append(s.charAt(i));
			}
		}//end of for-loop statement
		return strbuffer.toString();
	}//end of deleteWhiteSpace() method statement
	
}//end of StringHelper class statement