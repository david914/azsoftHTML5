/******************************************************************************
   ������Ʈ��   : ���� ������� �ý���
   ����ý��۸� : ����
   ���ϸ�       : Query_Execute_Util.java      
   ��������
   ������         �����       ��������
-------------------------------------------------------------------------------
   2006. 08. 08.  TEOK.KANG        ���ʻ��� 
******************************************************************************/
package com.ecams.common.sql;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.log4j.Logger;

import com.ecams.common.logger.EcamsLogger;

/**
 * ResultSet, Dataset���κ��� NULLó���� �Ѵ�.
 *
 * @author TEOK.KANG
 * @version 1.0, 2006. 01. 10.
 */
public class Query_Execute_Util {
	
    /**
     * Resultset���� TYPE�� �°� RS.SET�� �մϴ�.
     * @param rs ResultSet
     * @param id Ű�� ���ڿ�
     * @param type SQL TYPE
     * @return NULLó���� ���ڿ�
     * @throws SQLException
     */
    public static String rsGet(ResultSet rs, String id, int type) throws SQLException {
		Logger ecamsLogger  = EcamsLogger.getLoggerInstance();    	
    	String rtn_val = null;
    	if (type == -1 || type == 1 || type == 12 || type == 93 || type == 91 || type == 92){
	        if (rs.getString(id) == null) {
	        	rtn_val = "";
	        } else {
	        	rtn_val = rs.getString(id);
	        }//end of if-else statement
    	}else if (type == 2 || type == 4){
	        if (rs.getInt(id) == 0) {
	        	rtn_val = "0";
	        } else {
	        	rtn_val = rs.getInt(id)+"";
	        }//end of if-else statement
    	}else if (type == 8){
	        if (rs.getDouble(id) == 0) {
	        	rtn_val = "";
	        } else {
	        	rtn_val = rs.getDouble(id)+"";
	        }//end of if-else statement
    	}else if (type == 6){
	        if (rs.getFloat(id) == 0) {
	        	rtn_val = "";
	        } else {
	        	rtn_val = rs.getFloat(id)+"";
	        }//end of if-else statement
    	}else{
    		ecamsLogger.info("WARNING!!! NEW TYPE ADD NECESSITY...........");
    	}//end of if-else statement
    	
		return rtn_val;
    }//end of method rsGet() statement
    

    /**
     * ResultSet���� HashMap�� ������.
     * @param rs ResultSet
     * @return ArrayList
     * @throws SQLException
     */
    public static ArrayList getHashMapFromRs(ResultSet rs) throws SQLException{
        ResultSetMetaData rsmd = rs.getMetaData();
        int cntCol = rsmd.getColumnCount();
        
        ArrayList arraylist = new ArrayList();
        //HashMap define
        HashMap hashmap     = new HashMap();
        int j = 0;
        
        while (rs.next()) {
            for (int i = 1; i <= cntCol; i++) {
            	hashmap.put(rsmd.getColumnLabel(i),rsGet(rs, rsmd.getColumnLabel(i), rsmd.getColumnType(i)));
            }
            arraylist.add(j, hashmap);
            j++;
        }
        return arraylist;           
    }//end of method() getHashMapFromRs

}//end of class Query_Execute_Util
