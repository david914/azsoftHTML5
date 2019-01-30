/*****************************************************************************************
	1. program ID	: eCmm1800.java
	2. create date	: 2008.11
	3. auth		    : min suk
	4. update date	: 2009.01.02
	5. auth		    : No Name
	6. description	: [������] -> [��������]
*****************************************************************************************/

package app.eCmm;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.log4j.Logger;
import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;


/**
 * @author bigeyes
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */


public class Cmm1800{
    /**
     * Logger Class Instance Creation
     * logger
     */
    Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
    
    
    /**
     * <PRE>
     * 1. MethodName	: getLoginUser
     * 2. ClassName		: Cmm1800
     * 3. Commnet			: �α��λ���ڸ���Ʈ ��ȸ. cmm0040 ���̺� CM_STATUS='1'�� �� ��ȸ
     *                        �α��� com.ecams.service.list.LoginManager.updateLoginIp ����
     *                        status = '1' ������Ʈ
     *                        �α׾ƿ� com.ecams.service.list.LoginManager.valueUnbound ���� 
     *                        status = '0' ������Ʈ
     * 4. �ۼ���				: no name
     * 5. �ۼ���				: 2011. 1. 10. ���� 9:22:58
     * </PRE>
     * 		@return Object[]
     * 		@return
     * 		@throws SQLException
     * 		@throws Exception
     */
    public Object[] getLoginUser() throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		
		ConnectionContext connectionContext = new ConnectionResource();
		try {
			conn = connectionContext.getConnection(); 
			
			strQuery.setLength(0);
			strQuery.append("select a.CM_USERID, a.CM_USERNAME, a.CM_LOGINDT, a.CM_IPADDRESS, a.CM_TELNO1, b.CM_CODENAME as POSITION, C.CM_DEPTNAME \n"); 
			strQuery.append("  From cmm0040 a, cmm0020 b, cmm0100 c \n");
			strQuery.append(" Where a.CM_STATUS='1' \n");
			strQuery.append("   And a.CM_CLSDATE is null \n"); 
			strQuery.append("   And b.CM_MACODE = 'POSITION' AND b.CM_MICODE = a.CM_POSITION \n"); 
			strQuery.append("   And A.CM_PROJECT=C.CM_DEPTCD \n");
			strQuery.append(" Order by a.CM_LOGINDT \n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
            rs = pstmt.executeQuery();
            rsval.clear();
            
            while (rs.next()){
            	rst = new HashMap<String, String>();
				rst.put("CM_USERID", rs.getString("CM_USERID")); 		//���
				rst.put("CM_USERNAME", rs.getString("CM_USERNAME")); 	//����
				rst.put("CM_LOGINDT", rs.getString("CM_LOGINDT"));		//�α����Ͻ�
				rst.put("CM_IPADDRESS", rs.getString("CM_IPADDRESS"));	//����IP
				rst.put("CM_TELNO1", rs.getString("CM_TELNO1"));		//��ȭ��ȣ1
				rst.put("POSITION", rs.getString("POSITION"));
				rst.put("CM_DEPTNAME", rs.getString("CM_DEPTNAME"));
				rsval.add(rst);
				rst = null;
			}
            rs.close();
            pstmt.close();
            conn.close();
            conn = null;
            
            return rsval.toArray();
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmm1800.getLoginUser() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmm1800.getLoginUser() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmm1800.getLoginUser() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmm1800.getLoginUser() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rsval != null)	rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1800.getLoginUser() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getLoginUser() method statement
    
}//end of Cmm1800 class statement
