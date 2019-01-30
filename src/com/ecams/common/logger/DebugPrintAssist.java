
/******************************************************************************
   ������Ʈ��    : ������� �ý���
   ����ý��۸�  : Logger Print Assist 
   ���ϸ�       : DebugPrint.java      
   ��������
   ������         �����       ��������
-------------------------------------------------------------------------------
  2006. 08. 08.  TEOK.KANG     ���ʻ���
******************************************************************************/

package com.ecams.common.logger;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import org.apache.log4j.Logger;
import com.ecams.common.logger.EcamsLogger;

/**
 * 	Logger Print Assist 
 */
public class DebugPrintAssist {
	
	/**
	 * RESULTSET �α׸� ����մϴ�.
	 * @param  val_str ������ ���а�(SQL SCRIPT)
	 * @param  rs      ��´�� ResultSet
	 * @param  rsmd    ��´�� ResultSetMetaData
	 * @return void
	 * @throws SQLException 
	 */
	public static synchronized void loggerPrint(String val_str, ResultSet rs, ResultSetMetaData rsmd) throws SQLException{
		Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
		ecamsLogger.debug(" ");		
		ecamsLogger.debug("�ڡ�DEBUGPRINT START�ڡ�    [" + val_str + "] ");
		ecamsLogger.debug("==TOTAL ROW COUNT     = [" + rs.getRow() + "]");
		ecamsLogger.debug("==TOTAL COL COUNT     = [" + rsmd.getColumnCount() + "]");		
		ecamsLogger.debug("==ResultSet UNIQUE ID = [" + rs.toString() + "]");
		
		int i = 0;
		while (rs.next()){
			ecamsLogger.debug("==ROW INDEX["+i+"]==[" + val_str + "]");
			for (int j = 0; j < rsmd.getColumnCount(); j++){
				ecamsLogger.debug(rsmd.getColumnLabel(j)+"=> [" + rs.getObject(rsmd.getColumnName(j))+"]");
			}//end of inner for-loop statement
			i++;
		}//end of for-loop statement
		ecamsLogger.debug("�ڡ�DEBUGPRINT END�ڡ� [" + val_str + "]");
		ecamsLogger.debug(" ");		
	}//end of loggerPrint method statement

	/**
	 * TRANSACTION QUERY PRINT. (SQL EXECUTION)
	 * @param val_str ������ ���а�
	 * @param ds      ��´�� DATASET
	 */
	public static synchronized void loggerPrint_tr(String val_str, String sql, Object[] param){
		Logger ecamsLogger  = EcamsLogger.getLoggerInstance();		
		ecamsLogger.debug(" ");		
		ecamsLogger.debug("## DEBUGPRINT TR. START ## [" + val_str + "] ");
		ecamsLogger.debug("== START OF SQL QUERY ==");	
		ecamsLogger.debug("[" + sql + "]");
		ecamsLogger.debug("== END OF SQL QUERY ==");			
		ecamsLogger.debug("== TOTAL PARAMETERS COUNT== [" + param.length + "]");	
		for (int i = 0; i < param.length; i++){
			ecamsLogger.debug("["+val_str+"]==PARAMETERS INDEX["+i+"], VALUE=[" + param[i] + "]");
		}//end of for-loop statement
		ecamsLogger.debug("## DEBUGPRINT TR. END ## [" + val_str + "]");
		ecamsLogger.debug(" ");		
	}//end of loggerPrint method statement

}//end of class DebugPrintAssist statement
