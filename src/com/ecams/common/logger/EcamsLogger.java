/******************************************************************************
   ������Ʈ��    : ������� �ý���
   ����ý��۸�  : Log4j�� ����
   ���ϸ�       : EcamsLogger.java
   ��������
   ������         �����       ��������
-------------------------------------------------------------------------------
  2006. 08. 08.  TEOK.KANG     ���ʻ���
******************************************************************************/
package com.ecams.common.logger;

import java.net.URL;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

/**
 * @author bigeyes
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class EcamsLogger {

	//static EcamsLogger kl_instance = null;
	static Logger           l_instance  = null;

	private EcamsLogger (){
	}//end of EcamsLogger() construct statement

	/** 
	 * Logger ��ü�� ���� return
	 * @return Logger
	 */
	public static Logger getLoggerInstance(){
		ClassLoader cl;

		if(l_instance == null){
			synchronized(Logger.class) {
				if(l_instance == null){
	            	cl = Thread.currentThread().getContextClassLoader();
	                if( cl == null ){
	                    cl = ClassLoader.getSystemClassLoader();
	                }
	                PropertyConfigurator.configure(cl.getResource("Log4J.properties"));

					l_instance = Logger.getRootLogger();
				}
			}
		}
		return l_instance;
	}//end of static getLoggerInstance() method statement

	/**
	 * Logger ��ü�� ����� properties ������ �Ҷ� server restart�� ���ϰ� ����Ҽ� �ְ� �ϱ����� �޽��
	 * @return Logger
	 */
	public Logger resetLoggerInstance(){
		ClassLoader cl;
        URL prop_url;

		synchronized(Logger.class) {
        	cl = Thread.currentThread().getContextClassLoader();
            if( cl == null ){
                cl = ClassLoader.getSystemClassLoader();
            }
            PropertyConfigurator.configure(cl.getResource("Log4J.properties"));

			l_instance = Logger.getRootLogger();
		}
		return l_instance;
	}//end of static resetLoggerInstance() method statement

}//end of class EcamsLogger statement
