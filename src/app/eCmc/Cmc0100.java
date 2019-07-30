package app.eCmc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.io.File;

import org.apache.log4j.Logger;

import app.common.LoggableStatement;
import app.eCmr.Cmr0200;
import app.common.AutoSeq;
import app.common.Holiday_Check;
import app.common.PrjInfo;
import app.common.SystemPath;

import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;

public class Cmc0100 {
	static Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
	
	public int getDocSeq(String srid, String reqCd) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet		  rs		  = null;
		StringBuffer      strQuery    = new StringBuffer();
		int 			  retSeq	  = 0;
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			if(!srid.equals("") || srid != null)
			{
				strQuery.setLength(0);
				strQuery.append("SELECT nvl(max(cc_seq),0) maxseq	            	\n");
				strQuery.append("  FROM cmc0101										\n");
				strQuery.append(" WHERE cc_srid = ?									\n");
				strQuery.append("   AND	cc_division = ?								\n");
				
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt = new LoggableStatement(conn,strQuery.toString());
				pstmt.setString(1, srid);
				pstmt.setString(2, reqCd);
				
				
				rs = pstmt.executeQuery();
				if(rs.next()){
					retSeq = rs.getInt("maxseq");
				}				
				rs.close();
				pstmt.close();
				conn.close();
			}
			
			
			rs = null;
			pstmt = null;
			conn = null;
			ecamsLogger.error("++++ retSeq++++"+Integer.toString(retSeq));
			return retSeq;
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getDocSeq() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getDocSeq() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getDocSeq() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getDocSeq() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getDocSeq() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getDocSeq() method statement
	
	public Object[] getUserCombo(String combo_select,String search_dept,String search_user,String UserId) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		Object[] returnObjectArray    = null;
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
			strQuery.append("	 SELECT a.cm_userid , a.cm_username, a.cm_project, b.cm_deptname	\n");
			strQuery.append("  	   FROM cmm0040 a, cmm0100 b										\n");
			strQuery.append(" 	  WHERE a.cm_active = 1												\n");
			strQuery.append("   	AND a.cm_clsdate is null										\n");
			strQuery.append("   	AND a.cm_project = b.cm_deptcd									\n");
			if (UserId != null && !"".equals(UserId)) {
				strQuery.append("	AND a.cm_userid=?       										\n");
			} else if(combo_select.equals("DEPT")){//�μ��� �˻�
				strQuery.append("	AND a.cm_project = ?											\n");
				strQuery.append("	AND a.cm_username like ? 										\n");
			} else if(combo_select.equals("REQUSER") || combo_select.equals("DEVUSER")){//���������� �˻�
				strQuery.append("	AND a.cm_username like ? 										\n");
			}
			
	        pstmt = conn.prepareStatement(strQuery.toString());
	        //pstmt = new LoggableStatement(conn,strQuery.toString());
	        if (UserId != null && !"".equals(UserId)) {
	        	pstmt.setString(1, UserId);
	        } else if(combo_select.equals("DEPT")){//�μ��� �˻�
	        	pstmt.setString(1, search_dept);
	        	pstmt.setString(2, "%"+search_user+"%");
			} else if(combo_select.equals("REQUSER") || combo_select.equals("DEVUSER")){//���������� �˻�
				pstmt.setString(1, "%"+search_user+"%");
			}
	        
	        //ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	        rs = pstmt.executeQuery();
	        
	        rst = new HashMap<String, String>();
	        rst.put("cm_userid", "0000");
			rst.put("cm_username", "");
			rst.put("cm_idname", "�����ϼ���");
			rst.put("cm_deptcd", "0000");
			rst.put("cm_deptname", "");
			rst.put("select_combo", combo_select);
			rsval.add(rst);
			rst = null;
	        while(rs.next()) {
	        	rst = new HashMap<String, String>();
				rst.put("cm_userid", rs.getString("cm_userid"));
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("cm_idname", rs.getString("cm_username")+"["+rs.getString("cm_userid")+"]");
				rst.put("cm_deptcd", rs.getString("cm_project"));
				rst.put("cm_deptname", rs.getString("cm_deptname"));
				rst.put("select_combo", combo_select);
				
    	        rsval.add(rst);
				rst = null;
	        }
			
	        rs.close();
	        pstmt.close();
	        conn.close();
	        
	  		rs = null;
	  		pstmt = null;
	  		conn = null;
			
			returnObjectArray = rsval.toArray();
			rsval.clear();
			rsval = null;

			return returnObjectArray;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getUserCombo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getUserCombo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getUserCombo() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getUserCombo() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (returnObjectArray != null)	returnObjectArray = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getUserCombo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getISRList() method statement
	
	public Object[] getDocList(String cc_srid, String reqCd) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		Object[] returnObjectArray    = null;
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
			strQuery.append("SELECT a.cc_srid,												\n");
			strQuery.append("		a.cc_division,											\n");
			strQuery.append(" 		a.cc_seq,												\n");
			strQuery.append(" 		a.cc_filename,											\n");
			strQuery.append(" 		a.cc_savename,											\n");
			strQuery.append(" 		a.cc_createdate,										\n");
			strQuery.append(" 		to_char(a.cc_createdate,'YYYY/MM/DD') createdate,		\n");
			strQuery.append(" 		a.cc_createuser,										\n");
			strQuery.append(" 		b.cm_username createuser,a.cc_caseseq					\n");
			strQuery.append("  FROM cmc0101 a, cmm0040 b									\n");
			strQuery.append(" WHERE a.cc_srid = ?											\n");
			strQuery.append("   AND a.cc_createuser = b.cm_userid							\n");
			if (reqCd.equals("XX")) {
				strQuery.append("   AND a.cc_division in ('41','54','55')          		    \n");
			} else {
				strQuery.append("   AND a.cc_division=?  			           		        \n");
			}
			strQuery.append("ORDER BY a.cc_seq												\n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, cc_srid);
			if (!reqCd.equals("XX")) pstmt.setString(2, reqCd);
			
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				rst = new HashMap<String, String>();
				rst.put("cc_srid", rs.getString("cc_srid"));
				rst.put("cc_division", rs.getString("cc_division"));
				rst.put("cc_seq", rs.getString("cc_seq"));
				rst.put("name", rs.getString("cc_filename"));
				rst.put("cc_savename", rs.getString("cc_savename"));
				rst.put("cc_createdate", rs.getString("cc_createdate"));
				rst.put("cc_creatuser", rs.getString("cc_createuser"));
				rst.put("createuser", rs.getString("createuser"));
				rst.put("createdate", rs.getString("createdate"));
				rst.put("cc_caseseq", rs.getString("cc_caseseq"));
				
				rsval.add(rst);
				rst = null;
			}
			
			rs.close();
			pstmt.close();
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			
			returnObjectArray = rsval.toArray();
			rsval.clear();
			rsval = null;
			
			return returnObjectArray;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getDocList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getDocList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getDocList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getDocList() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (returnObjectArray != null)	returnObjectArray = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getDocList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getDocList() method statement
	
	public String deleteDoc(HashMap<String,String> tmp_obj) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			
			fileDelete(tmp_obj,conn);
			
			strQuery.setLength(0);
			strQuery.append("DELETE cmc0101				\n");
			strQuery.append(" WHERE cc_srid = ?			\n");
			strQuery.append("   AND cc_division = ?		\n");
			strQuery.append("   AND cc_seq = ?			\n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			
			pstmt.setString(1, tmp_obj.get("cc_srid"));
			pstmt.setString(2, tmp_obj.get("cc_division"));
			pstmt.setString(3, tmp_obj.get("cc_seq"));
			
			pstmt.executeUpdate();
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			pstmt.close();
			conn.close();
			
			pstmt = null;
			conn = null;
			
			return "OK";
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.deleteDoc() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.deleteDoc() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.deleteDoc() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.deleteDoc() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.deleteDoc() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}

	/** SRID�� ÷�ε�  ÷������ AP�������� ����. CMC0101���̺� �̷��� ���� ����.
	 * @param tmp_obj {cc_srid:�䱸ID},
	 * @param         {cc_division:��û�����ڵ�CMM0020 CM_MACODE='REQUEST' Ȯ��},
	 * @param         {cc_seq:CMC0101���̺� ����� SRID�� ÷������ �Ϸù�ȣ},
	 * @param         {cc_caseseq:CMC0101���̺� ����� SRID�� �׽�Ʈ���̽���ȣ}
	 * @param conn
	 * @return boolean true:����
	 * @throws SQLException
	 * @throws Exception
	 */
	public boolean fileDelete(HashMap<String,String> tmp_obj,Connection conn) throws SQLException, Exception {
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		File              docfile     = null;
		
		try {
			
			String docfileName  = "";
			int parmCnt = 0;
			
			strQuery.setLength(0);
			strQuery.append("select b.cc_savename,a.cm_path      \n");
			strQuery.append("  from cmc0101 b,cmm0012 a          \n");
			strQuery.append(" where a.cm_stno='ECAMS'            \n");
			strQuery.append("   and a.cm_pathcd='21'             \n");
			strQuery.append("   and b.cc_srid=?                  \n");
			strQuery.append("   AND b.cc_division = ?	    	 \n");
			if (tmp_obj.get("cc_seq") != null && !tmp_obj.get("cc_seq").equals("")) {
				strQuery.append("   AND b.cc_seq = ?		     \n");
			}
			if (tmp_obj.get("cc_caseseq") != null && !tmp_obj.get("cc_caseseq").equals("")) {
				strQuery.append("   AND b.cc_caseseq = ?	     \n");
			}
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(++parmCnt, tmp_obj.get("cc_srid"));
			pstmt.setString(++parmCnt, tmp_obj.get("cc_division"));
			if (tmp_obj.get("cc_seq") != null && !tmp_obj.get("cc_seq").equals("")) {
				pstmt.setString(++parmCnt, tmp_obj.get("cc_seq"));
			}if (tmp_obj.get("cc_caseseq") != null && !tmp_obj.get("cc_caseseq").equals("")) {
				pstmt.setString(++parmCnt, tmp_obj.get("cc_caseseq"));
			}
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			while (rs.next()) {
				docfileName = rs.getString("cm_path")+ rs.getString("cc_savename"); 
				docfile = new File(docfileName);
				if( (docfile.isFile()) )//File���翩��
				{
					docfile.delete();
				}
				docfile = null;
				docfileName = "";
			}
			rs.close();
			pstmt.close();
			rs = null;
			pstmt = null;
			
			return true;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.fileDelete() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.fileDelete() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.fileDelete() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.fileDelete() Exception END ##");				
			throw exception;
		}finally{
			if ( docfile != null ) docfile = null;
			if (strQuery != null) 	strQuery = null;
			if (rs != null)  try{rs.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
		}
	}
	
	public String rmfile(String filepath) throws SQLException, Exception {
		try {
			SystemPath systemPath = new SystemPath();
			String path = systemPath.getTmpDir("21");
			
			systemPath = null;
			
			ecamsLogger.error(">>>>>>>>>>"+path+filepath);
			
			File filez = new File(path+filepath);
			if(filez.exists() && filez.isFile()) {
				filez.delete();
			}
			filez = null;
			
			return "OK";
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.rmfile() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.rmfile() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.rmfile() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.rmfile() Exception END ##");				
			throw exception;
		}finally{
		}
	}
	
	
	public Object[] getDevUserList(String cc_srid,String userid) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		Object[] returnObjectArray    = null;
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
			strQuery.append("SELECT a.cc_srid,										\n");
			strQuery.append("		a.cc_userid,									\n");
			strQuery.append("		c.cm_username,									\n");
			strQuery.append(" 		a.cc_createdate,								\n");
			strQuery.append(" 		a.cc_createuser,								\n");
			strQuery.append(" 		a.cc_status,									\n");
			strQuery.append(" 		b.cm_deptcd,									\n");
			strQuery.append(" 		b.cm_deptname,									\n");
			strQuery.append(" 		d.cm_codename,									\n");
			strQuery.append(" 		decode(a.cc_status,'8','NO','9','NO',CHECKINYN(a.cc_userid,a.cc_srid,'41',?,a.cc_status)) delyn   \n");
			strQuery.append("  FROM cmm0020 d,cmc0110 a,cmm0100 b,cmm0040 c 		\n");
			strQuery.append(" WHERE a.cc_srid = ?									\n");
			strQuery.append("   AND a.cc_status<>'3'  							    \n");
			strQuery.append("   AND a.cc_userid = c.cm_userid						\n");
			strQuery.append("   AND c.cm_project = b.cm_deptcd						\n");
			strQuery.append("   AND d.cm_macode='ISRSTAUSR' 						\n");
			strQuery.append("   AND d.cm_micode=a.cc_status 						\n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, userid);
			pstmt.setString(2, cc_srid);
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				rst = new HashMap<String, String>();
				rst.put("cc_srid", rs.getString("cc_srid"));
				rst.put("cc_userid", rs.getString("cc_userid"));
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("cc_createdate", rs.getString("cc_createdate"));
				rst.put("cc_createuser", rs.getString("cc_createuser"));
				rst.put("cc_status", rs.getString("cc_status"));
				rst.put("cm_deptcd", rs.getString("cm_deptcd"));
				rst.put("cm_deptname", rs.getString("cm_deptname"));
				rst.put("cm_codename", rs.getString("cm_codename"));
				rst.put("delyn", rs.getString("delyn"));
				
				rsval.add(rst);
				rst = null;
			}
			
			rs.close();
			pstmt.close();
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			
			returnObjectArray = rsval.toArray();
			rsval.clear();
			rsval = null;
			
			return returnObjectArray;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getDevUserList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getDevUserList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getDevUserList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getDevUserList() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (returnObjectArray != null)	returnObjectArray = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getDevUserList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getDevUserList() method statement
	
	public Object[] selectSRInfo(String cc_srid) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		Object[] returnObjectArray    = null;
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
			strQuery.append("SELECT a.cc_srid, b.cm_username createuser, to_char(a.cc_createdate,'yyyy/mm/dd') createdate,a.cc_docid,										\n");
			//strQuery.append("       a.cc_reqdept, c.cm_deptname reqdept, a.cc_requser, d.cm_username requser,                           									\n");
			strQuery.append("       a.cc_reqdept, c.cm_deptname reqdept, 						                           													\n");
			strQuery.append("       a.cc_reqtitle, a.cc_reqcompdate, a.cc_content,                                                   										\n");
			strQuery.append("       a.cc_cattype,	(SELECT cm_codename FROM CMM0020 WHERE cm_macode = 'CATTYPE' AND cm_micode = a.cc_cattype) cattype, a.cc_excdate,       \n");																																																		
			strQuery.append("       a.cc_chgtype,	(SELECT cm_codename FROM CMM0020 WHERE cm_macode = 'CHGTYPE' AND cm_micode = a.cc_chgtype) cghtype, a.cc_exptime,       \n");																																																		
			strQuery.append("       a.cc_workrank,	(SELECT cm_codename FROM CMM0020 WHERE cm_macode = 'WORKRANK' AND cm_micode = a.cc_workrank) workrank, a.cc_reqsecu,	\n");																																																		
			strQuery.append("       a.cc_txtreqsecu, a.cc_realdatause,					                                              										\n");																																																		
			strQuery.append("       (select max(cc_acptno) from cmc0300 where cc_srid=a.cc_srid and cc_qrycd='41') acptno             										\n");																																																		
			//strQuery.append("  FROM cmc0100 a, cmm0040 b, cmm0100 c, cmm0040 d                      																		\n");																																																		
			strQuery.append("  FROM cmc0100 a, cmm0040 b, cmm0100 c                     																					\n");
			strQuery.append(" WHERE a.cc_srid = ?				                                                                    										\n");																																																		
			strQuery.append("   AND a.cc_createuser = b.cm_userid                                                                    										\n");																																																		
			strQuery.append("   AND a.cc_reqdept = c.cm_deptcd                                                                       										\n");																																																		
			//strQuery.append("   AND a.cc_requser = d.cm_userid                                                                       										\n");																																																		

			//pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, cc_srid);
			
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			
			while(rs.next()) {
				rst = new HashMap<String, String>();
				rst.put("cc_srid", rs.getString("cc_srid"));
				rst.put("createuser", rs.getString("createuser"));
				rst.put("createdate", rs.getString("createdate"));
				rst.put("cc_docid", rs.getString("cc_docid"));
				rst.put("cc_reqdept", rs.getString("cc_reqdept"));
				rst.put("reqdept", rs.getString("reqdept"));
				rst.put("cc_requser", "");
				rst.put("requser", "");
				rst.put("cc_reqtitle", rs.getString("cc_reqtitle"));
				rst.put("cc_reqcompdate", rs.getString("cc_reqcompdate"));
				rst.put("cc_content", rs.getString("cc_content"));
				rst.put("cc_cattype", rs.getString("cc_cattype"));
				rst.put("cattype", rs.getString("cattype"));
				rst.put("cc_excdate", rs.getString("cc_excdate"));
				rst.put("cc_chgtype", rs.getString("cc_chgtype"));
				rst.put("cghtype", rs.getString("cghtype"));
				rst.put("cc_exptime", rs.getString("cc_exptime"));
				rst.put("cc_workrank", rs.getString("cc_workrank"));
				rst.put("workrank", rs.getString("workrank"));
				rst.put("cc_reqsecu", rs.getString("cc_reqsecu"));
				rst.put("cc_txtreqsecu", rs.getString("cc_txtreqsecu"));
				rst.put("cc_realdatause", rs.getString("cc_realdatause"));
				rst.put("acptno", rs.getString("acptno"));				
				rsval.add(rst);
				rst = null;
			}
			
			rs.close();
			pstmt.close();
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			
			returnObjectArray = rsval.toArray();
			rsval.clear();
			rsval = null;
			
			return returnObjectArray;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getDevUserList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getDevUserList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getDevUserList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getDevUserList() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (returnObjectArray != null)	returnObjectArray = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getDevUserList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getDevUserList() method statement
	
	public String insertSRInfo(HashMap<String,String> tmp_obj, ArrayList<HashMap<String,String>> devuser_ary,ArrayList<HashMap<String,Object>> ConfList) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet		  rs		  = null;
		StringBuffer      strQuery    = new StringBuffer();
		int 			  param_cnt	  = 1;
		String 			  SR_ID		  = "";
		boolean           confSw      = false;
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			if (ConfList != null && ConfList.size()>0) confSw = true;
			strQuery.setLength(0);
			//SR_ID �ְ��� ���Ͽ� ���ο� SR_ID�� ����
			strQuery.append("SELECT lpad(to_number(nvl(max(substr(cc_srid,9,11)),'0'))+1,4,'0') max,		\n");
			strQuery.append("		to_char(SYSDATE,'YYYYMM') yyyymm											\n");
			strQuery.append("  FROM cmc0100																	\n");
			strQuery.append(" WHERE substr(cc_srid,2,6) = to_char(SYSDATE,'YYYYMM')							\n");
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			
			if(rs.next()){
				SR_ID = "R"+rs.getString("yyyymm")+"-"+rs.getString("max");
			}
			
			rs.close();
			pstmt.close();
			
			conn.setAutoCommit(false);
			
			strQuery.setLength(0);
			strQuery.append("INSERT INTO CMC0100(cc_srid,   	cc_createuser, 	cc_createdate, cc_lastupdate,  cc_lastupuser, 			\n");
			strQuery.append("			 	     cc_docid,    	cc_reqdept,    	cc_requser,    cc_reqtitle,    cc_reqcompdate, 			\n");
			strQuery.append("			         cc_content,    cc_cattype,    	cc_chgtype,    cc_excdate,     cc_exptime,  			\n");
			strQuery.append("			 	     cc_workrank,   cc_status,    	cc_devdept,    cc_reqsecu,     cc_txtreqsecu,			\n");
			strQuery.append("			 	     cc_realdatause,cc_reqdate)     								   				        \n");
			strQuery.append("(select 			 ?,			  	?,	   			SYSDATE,	   SYSDATE,		   ?,	 					\n");
			strQuery.append("			 		 ?,			  	?,			 	?,			   ?,			   ?,						\n");
			strQuery.append("			 		 ?,			  	?,			 	?,			   ?,			   ?,						\n");
			strQuery.append("			 		 ?,			    ?,  		    cm_project,    ?,              ?,						\n");
			strQuery.append("			 		 ?,             TO_CHAR(SYSDATE, 'YYYYMMDD')											\n");
			strQuery.append("   from  cmm0040 where cm_userid=?)                                                                        \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(param_cnt++, SR_ID);
			pstmt.setString(param_cnt++, tmp_obj.get("cc_createuser"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_createuser"));
			
			pstmt.setString(param_cnt++, tmp_obj.get("cc_docid"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqdept"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_requser"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqtitle"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqcompdate").replace("/", ""));
			
			pstmt.setString(param_cnt++, tmp_obj.get("cc_content"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_cattype"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_chgtype"));
			if( tmp_obj.get("cc_excdate") != null && tmp_obj.get("cc_excdate") != "" ){
				pstmt.setString(param_cnt++, tmp_obj.get("cc_excdate").replace("/", ""));
			} else {
				pstmt.setString(param_cnt++, null);
			}
			if( tmp_obj.get("cc_exptime") != null && tmp_obj.get("cc_exptime") != "" ){
				pstmt.setString(param_cnt++, tmp_obj.get("cc_exptime"));
			} else {
				pstmt.setString(param_cnt++, null);
			}
			
			pstmt.setString(param_cnt++, tmp_obj.get("cc_workrank"));
			if (confSw) pstmt.setString(param_cnt++,"1");
			else pstmt.setString(param_cnt++,"2");
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqsecu"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqsecutxt"));
			
			pstmt.setString(param_cnt++, tmp_obj.get("cc_realdatause"));
			
			pstmt.setString(param_cnt++, tmp_obj.get("cc_createuser"));
			pstmt.executeUpdate();
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			pstmt.close();
			
			for(int i=0; devuser_ary.size() > i; i++){
				strQuery.setLength(0);
				strQuery.append("INSERT INTO CMC0110	\n");
				strQuery.append("   (cc_srid,cc_userid,cc_createdate,cc_createuser,cc_status,cc_lastdate,cc_editor,cc_deptcd) 	\n");
				strQuery.append("   (select ?,cm_userid,SYSDATE,?,?,SYSDATE,?,cm_project                          \n");   
				strQuery.append("	   from cmm0040 where cm_userid=?)      \n");
				
				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString());
				param_cnt = 1;
				pstmt.setString(param_cnt++, SR_ID);
				pstmt.setString(param_cnt++, tmp_obj.get("cc_createuser"));
				if (confSw) pstmt.setString(param_cnt++,"0");
				else pstmt.setString(param_cnt++,"1");
				pstmt.setString(param_cnt++, tmp_obj.get("cc_createuser"));
				pstmt.setString(param_cnt++, devuser_ary.get(i).get("cc_userid"));
				pstmt.executeUpdate();
				//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				pstmt.close();
			}
			
			if (confSw) {
				AutoSeq autoseq = new AutoSeq();
				String AcptNo;
				int i = 0;
	        	do {
			        AcptNo = autoseq.getSeqNo(conn,tmp_obj.get("reqcd"));

			        i = 0;
			        strQuery.setLength(0);		        
			        strQuery.append("select count(*) as cnt from cmc0300 \n");
		        	strQuery.append(" where cc_acptno= ?                 \n");		        
		        	
		        	pstmt = conn.prepareStatement(strQuery.toString());
		        	pstmt.setString(1, AcptNo);		        	
		        	rs = pstmt.executeQuery();
		        	
		        	if (rs.next()){
		        		i = rs.getInt("cnt");
		        	}	        	
		        	rs.close();
		        	pstmt.close();
		        } while(i>0);
	        	
	        	PrjInfo prjinfo = new PrjInfo();
	    		String retMsg = prjinfo.base_Confirm(AcptNo,SR_ID,tmp_obj.get("cc_lastupuser"),tmp_obj.get("reqcd"),conn);
	    		if (!retMsg.equals("0")) {
					conn.rollback();
					conn.close();
					throw new Exception("SR���ο�û�⺻ ���� ��� �� ������ �߻��Ͽ����ϴ�. �����ڿ��� �����Ͽ� �ֽñ� �ٶ��ϴ�.");
	    		}
	    		
	    		Cmr0200 cmr0200 = new Cmr0200();
				retMsg = cmr0200.request_Confirm(AcptNo,"99999",tmp_obj.get("reqcd"),tmp_obj.get("cc_lastupuser"),true,ConfList,conn);
				if (!retMsg.equals("OK")) {
					conn.rollback();
					conn.close();
					throw new Exception("����������� �� ������ �߻��Ͽ����ϴ�. �����ڿ��� �����Ͽ� �ֽñ� �ٶ��ϴ�.");
				}
			}
			conn.commit();
			conn.setAutoCommit(true);
			
			tmp_obj.put("SR_ID", SR_ID);
			tmp_obj.put("USER_ID", tmp_obj.get("cc_createuser"));
			tmp_obj.put("QRY_CD", tmp_obj.get("reqcd"));
			tmp_obj.put("CR_CONUSR", "insertSRInfo");//��ϵɰ����ڰ� �������̹Ƿ� SR���/���� �ÿ�  ������� ������ ����(�Լ���)������ ����.
			tmp_obj.put("CR_ACPTNO", "999999999999");
			tmp_obj.put("CR_NOTIGBN", "ED");//�Ϸ��ڵ�
//			[]:SRID, []:SR��û����, []:�������ID, []:��û�����ڵ�(CMM0020 CM_MACODE='REQUEST'), []:�������ID, []:��û��ȣ, []:�˸������ڵ�(CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����)
			String retNOTI = insertCMR9910ForNotice(tmp_obj, conn);
			ecamsLogger.error("Cmc0100.java insertSRInfo:SR��� �� CMR9910 inert �����["+retNOTI+"]");
//			 * @return String [0]:��ϿϷ�(S:SMS or C:eCAMSMSG),
//			 *                [1]:������(X),
//			 *                [2]:�˸������ȵ�(CMM0018 ���̺�,������->ȯ�漳��),
//			 *                [3]:��Ͻ���
//			 *                [70]:Exception
//			 *                [99]:SQLException
			
			tmp_obj.clear();
			
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			
			return SR_ID;
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.insertSRInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmc0100.insertSRInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.insertSRInfo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.insertSRInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmc0100.insertSRInfo() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.insertSRInfo() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.insertSRInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of insertSRInfo() method statement
	
	public String insertDocList(String srid, String reqcd, String userid,ArrayList<HashMap<String,String>> doc_list) throws SQLException, Exception {
		Connection        conn        = null;
		ResultSet		  rs		  = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		boolean           insSw       = true;
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
						
        	for(int i=0; doc_list.size()>i; i++){
        		insSw = false;
        		//ecamsLogger.error("+++ doc_list+++"+doc_list.get(i).get("fileseq")+ ", "+doc_list.get(i).get("cc_caseseq"));
        		strQuery.setLength(0);
            	strQuery.append("select count(*) cnt from cmc0101  \n");
            	strQuery.append(" WHERE cc_srid=? AND cc_division=?\n");
            	strQuery.append("   and cc_seq=?                   \n");
            	pstmt = conn.prepareStatement(strQuery.toString());
            	pstmt.setString(1, srid);
            	pstmt.setString(2, reqcd);
            	pstmt.setString(3, doc_list.get(i).get("fileseq"));
            	rs = pstmt.executeQuery();
            	if (rs.next()) {
            		if (rs.getInt("cnt") == 0) {
            			insSw = true;
            		}
            	}
            	rs.close();
            	pstmt.close();
            	
            	if (insSw) {
					strQuery.setLength(0);
					strQuery.append("INSERT INTO CMC0101(cc_srid,   	cc_division, 	cc_seq, cc_filename,  cc_savename, 				\n");
					strQuery.append("			 	     cc_createdate, cc_createuser,  cc_caseseq)  									\n");
					strQuery.append("VALUES(			 ?,			  	?,	   			?,	    ?,		      ?,	 						\n");
					strQuery.append("			 		 SYSDATE,		?,              ?) \n");
					
					pstmt = conn.prepareStatement(strQuery.toString());
					//pstmt = new LoggableStatement(conn,strQuery.toString());
					pstmt.setString(1, srid);
					pstmt.setString(2, reqcd);
					pstmt.setString(3, doc_list.get(i).get("fileseq"));
					pstmt.setString(4, doc_list.get(i).get("name"));
					pstmt.setString(5, doc_list.get(i).get("savefile"));
					pstmt.setString(6, userid);
					if (doc_list.get(i).get("cc_caseseq") != null && doc_list.get(i).get("cc_caseseq") != "") {
						pstmt.setString(7, doc_list.get(i).get("cc_caseseq"));
					} else {
						pstmt.setString(7, "0");
					}
					//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
					pstmt.executeUpdate();
					pstmt.close();
            	}
				
        	}
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			
			return "OK";
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.insertPrjInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.insertPrjInfo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.insertPrjInfo() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.insertPrjInfo() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)  try{rs.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.insertPrjInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of insertPrjInfo() method statement
	
	public String updateSRInfo(HashMap<String,String> tmp_obj, ArrayList<HashMap<String,String>> devuser,ArrayList<HashMap<String,Object>> ConfList) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2	  = null;
		ResultSet		  rs		  = null;
		StringBuffer      strQuery    = new StringBuffer();
		int 			  param_cnt	  = 1;
		String 			  SR_ID		  = tmp_obj.get("cc_srid");
		int 			  i			  = 0;
//		boolean           pgmSw       = false;
		boolean           confSw      = false;
		boolean           CMC0100UPSw = false;
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			
			if (ConfList != null && ConfList.size()>0) confSw = true;
			conn = connectionContext.getConnection();
			//���α׷�������� ���μ����� �����ϴ� �������� 
			//���α׷��� �����ϴ� �������� �ٲٴ��� Ȯ��
			/*
			strQuery.setLength(0);
			strQuery.append("select count(*) cnt from cmc0100 a,cmm0120 b \n");
			strQuery.append(" where a.cc_srid=? and a.cc_cattype<>?       \n");
			strQuery.append("   and a.cc_cattype=b.cm_cattype             \n");
			strQuery.append("   and b.cm_qrycd='07' and b.cm_useyn='N'    \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, SR_ID);
			pstmt.setString(2, tmp_obj.get("cc_cattype"));
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				if (rs.getInt("cnt")>0) {
					pgmSw = true;
				}
			}
			rs.close();
			pstmt.close();
			
			if (pgmSw) {
				pgmSw = false;
				strQuery.setLength(0);
				strQuery.append("select count(*) cnt from cmm0120 b \n");
				strQuery.append(" where b.cc_cattype=?              \n");
				strQuery.append("   and b.cm_qrycd='07'             \n");
				strQuery.append("   and b.cm_useyn='Y'              \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString());
				pstmt.setString(1, tmp_obj.get("cc_cattype"));
				//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				rs = pstmt.executeQuery();
				if (rs.next()) {
					if (rs.getInt("cnt")>0) {
						pgmSw = true;
					}
				}
				rs.close();
				pstmt.close();				
			}*/
			conn.setAutoCommit(false);
			strQuery.setLength(0);
			strQuery.append("UPDATE CMC0100 SET cc_lastupdate = SYSDATE, cc_lastupuser = ?,  cc_docid = ?,    cc_reqdept = ?, cc_requser = ?,		\n");
			strQuery.append("			 	    cc_reqtitle = ?,    	 cc_reqcompdate = ?, cc_content = ?,  cc_cattype = ?, cc_chgtype = ?,		\n");
			strQuery.append("			        cc_excdate = ?,     	 cc_exptime = ?, 	 cc_workrank = ?, 										\n");
			strQuery.append("			        cc_devdept = (select cm_project from cmm0040 where cm_userid = ?), 									\n");
			strQuery.append("			        cc_reqsecu = ?,		 cc_txtreqsecu = ?,     	 cc_realdatause = ?,								\n");
			strQuery.append("			        cc_status=decode(cc_status,'0',?,'C',?,cc_status)               									\n");
			if( tmp_obj.get("cc_status").equals("0") ) {
				strQuery.append("			    ,cc_createdate = sysdate,	cc_createuser = ?			   						                    \n");
			}
			strQuery.append("WHERE cc_srid = ?																										\n");
			
			//pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(param_cnt++, tmp_obj.get("cc_lastupuser"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_docid"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqdept"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_requser"));
			
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqtitle"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqcompdate").replace("/", ""));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_content"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_cattype"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_chgtype"));
			
			if( tmp_obj.get("cc_excdate") != null && tmp_obj.get("cc_excdate") != "" ){
				pstmt.setString(param_cnt++, tmp_obj.get("cc_excdate").replace("/", ""));
			} else {
				pstmt.setString(param_cnt++, null);
			}
			if( tmp_obj.get("cc_exptime") != null && tmp_obj.get("cc_exptime") != "" ){
				pstmt.setString(param_cnt++, tmp_obj.get("cc_exptime"));
			} else {
				pstmt.setString(param_cnt++, null);
			}
			pstmt.setString(param_cnt++, tmp_obj.get("cc_workrank"));
			//pstmt.setString(param_cnt++, tmp_obj.get("cc_devdept"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_createuser"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqsecu"));
			
			pstmt.setString(param_cnt++, tmp_obj.get("cc_reqsecutxt"));
			pstmt.setString(param_cnt++, tmp_obj.get("cc_realdatause"));
			if (confSw) {
				pstmt.setString(param_cnt++,"1");
				pstmt.setString(param_cnt++,"1");
			} else {
				pstmt.setString(param_cnt++,"2");
				pstmt.setString(param_cnt++,"2");
			}
			if( tmp_obj.get("cc_status").equals("0") ) {
				pstmt.setString(param_cnt++, tmp_obj.get("cc_lastupuser"));
			}
			pstmt.setString(param_cnt++, SR_ID);
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			pstmt.executeUpdate();
			
			pstmt.close();
			
			//�ش� SR_ID�� ��ϵǾ��ִ� ������ ��ȸ�Ͽ� ����
			strQuery.setLength(0);
			strQuery.append("update cmc0110 set cc_closedate=SYSDATE \n");
			strQuery.append(" WHERE cc_srid = ?	          	  \n");
			strQuery.append("   AND decode(cc_status,'8','NO','9','NO',CHECKINYN(cc_userid,cc_srid,'41',?,cc_status)) = 'OK'	 \n");
			strQuery.append("   and cc_status in ('0','1','2')\n");
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, SR_ID);
			pstmt.setString(2, tmp_obj.get("cc_lastupuser"));
			
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			pstmt.executeUpdate();
			pstmt.close();
			
			
			//��簳���ڰ� ������� �߰�
			for(i=0; devuser.size()>i; i++){
				strQuery.setLength(0);
				strQuery.append("SELECT cc_userid, cc_status		\n");
				strQuery.append("  FROM cmc0110			\n");
				strQuery.append(" WHERE cc_srid = ?		\n");
				strQuery.append("   AND cc_userid = ?	\n");
				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString());
				pstmt.setString(1, SR_ID);
				pstmt.setString(2, devuser.get(i).get("cc_userid"));
				//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				rs = pstmt.executeQuery();
		
				if(rs.next()){
					strQuery.setLength(0);
					//strQuery.append("UPDATE CMC0110 SET cc_status=decode(cc_status,'0','1',cc_status), 	\n");
					strQuery.append("UPDATE CMC0110  	\n");
					strQuery.append("SET cc_status=decode(cc_status,'0',?,'3',?,cc_status),   \n");
					strQuery.append("       cc_closedate='',cc_lastdate=SYSDATE,cc_editor=?   \n");
					strQuery.append(" WHERE cc_srid=?  									      \n");
					strQuery.append("   AND cc_userid=?  									  \n");
					
					//pstmt2 = conn.prepareStatement(strQuery.toString());
					pstmt2 = new LoggableStatement(conn,strQuery.toString());
					param_cnt = 1;
					if (confSw) {
						pstmt2.setString(param_cnt++, "0");
						pstmt2.setString(param_cnt++, "0");
					} else {
						pstmt2.setString(param_cnt++, "1");
						pstmt2.setString(param_cnt++, "1");
					}
					pstmt2.setString(param_cnt++, tmp_obj.get("cc_lastupuser"));
					pstmt2.setString(param_cnt++, SR_ID);
					pstmt2.setString(param_cnt++, devuser.get(i).get("cc_userid"));
					ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
					pstmt2.executeUpdate();
					pstmt2.close();
				}else{
					strQuery.setLength(0);
					strQuery.append("INSERT INTO CMC0110	\n");
					strQuery.append("   (cc_srid,cc_userid,cc_createdate,cc_createuser,cc_status,cc_lastdate,cc_editor,cc_deptcd) 	\n");
					strQuery.append("   (select ?,cm_userid,SYSDATE,?,?,SYSDATE,?,cm_project                            \n");   
					strQuery.append("	   from cmm0040 where cm_userid=?)      \n");
					//pstmt2 = conn.prepareStatement(strQuery.toString());
					pstmt2 = new LoggableStatement(conn,strQuery.toString());
					param_cnt = 1;
					pstmt2.setString(param_cnt++, SR_ID);
					pstmt2.setString(param_cnt++, tmp_obj.get("cc_lastupuser"));
					if (confSw) pstmt2.setString(param_cnt++, "0");
					else pstmt2.setString(param_cnt++, "1");
					pstmt2.setString(param_cnt++, tmp_obj.get("cc_lastupuser"));
					pstmt2.setString(param_cnt++, devuser.get(i).get("cc_userid"));
					ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
					pstmt2.executeUpdate();
					pstmt2.close();
				}
			}
    		
			strQuery.setLength(0);
			strQuery.append("update cmc0110 set cc_status='3'    \n");
			strQuery.append("      ,cc_closedate=SYSDATE         \n");
			strQuery.append("      ,cc_editor=?                  \n");
			strQuery.append(" WHERE cc_srid = ?            	     \n");
			strQuery.append("   and cc_closedate is not null     \n");
			strQuery.append("   and cc_status in ('0','1','2')   \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, tmp_obj.get("cc_lastupuser"));
			pstmt.setString(2, SR_ID);
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			pstmt.executeUpdate();
			pstmt.close();
			
			
			//20141016 neo. SR���� �������� ���°� ��� 9 �϶�(������ ������ �����ϰ�) SR���°��� ����͸� �Ϸ�� ������Ʈ �������.
			//�׷��� SR�ϷḦ ��� �� �� ����.
			strQuery.setLength(0);
			strQuery.append("SELECT cc_status \n");
			strQuery.append("  FROM cmc0110   \n");
			strQuery.append(" WHERE cc_srid=? \n");
			strQuery.append("   AND cc_status not in ('3','8') \n");//[3]���(����) �Ǵ� [8]�����ߴ�
			//pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, SR_ID);
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			while ( rs.next() ){
				//���°��� [9]����͸��Ϸᰡ �ƴϸ� SR���� ������Ʈ���� ����.
				CMC0100UPSw = true;
				if ( !rs.getString("cc_status").equals("9") ) {
					CMC0100UPSw = false;
					break;
				}
			}
			rs.close();
			pstmt.close();
			
			//�����ִ� �����ڰ� ��� [9]����͸��Ϸ� ���� �϶�  SR���°��� [4]������->[6]����͸��Ϸ�� ������Ʈ �ؾ���.
			if ( CMC0100UPSw ) {
				strQuery.setLength(0);
				strQuery.append("SELECT cc_status \n");
				strQuery.append("  FROM cmc0100   \n");
				strQuery.append(" WHERE cc_srid=? \n");
				strQuery.append("   AND cc_status = '4' \n");//[4]������
				//pstmt = conn.prepareStatement(strQuery.toString());
				pstmt = new LoggableStatement(conn,strQuery.toString());
				pstmt.setString(1, SR_ID);
				ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				rs = pstmt.executeQuery();
				if ( rs.next() ){
					strQuery.setLength(0);
					strQuery.append("UPDATE cmc0100 SET cc_status='6' \n");
					strQuery.append(" WHERE cc_srid = ? \n");
					pstmt2 = conn.prepareStatement(strQuery.toString());
					pstmt2.setString(1, SR_ID);
					pstmt2.executeUpdate();
					pstmt2.close();
				}
				rs.close();
				pstmt.close();
			}
			
			
			/*
			if (pgmSw) {
				strQuery.setLength(0);
				strQuery.append("update cmc0110 set cc_status='2'      \n");
				strQuery.append(" WHERE cc_srid = ?            	       \n");
				strQuery.append("   and cc_status in ('4','5','6','A') \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt = new LoggableStatement(conn,strQuery.toString());
				pstmt.setString(1, SR_ID);
				ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				pstmt.executeUpdate();
				pstmt.close();
			}*/
			
			if (confSw) {
				AutoSeq autoseq = new AutoSeq();
				String AcptNo;
	        	do {
			        AcptNo = autoseq.getSeqNo(conn,tmp_obj.get("reqcd"));

			        i = 0;
			        strQuery.setLength(0);		        
			        strQuery.append("select count(*) as cnt from cmc0300 \n");
		        	strQuery.append(" where cc_acptno= ?                 \n");		        
		        	
		        	pstmt = conn.prepareStatement(strQuery.toString());
		        	pstmt.setString(1, AcptNo);		        	
		        	rs = pstmt.executeQuery();
		        	
		        	if (rs.next()){
		        		i = rs.getInt("cnt");
		        	}	        	
		        	rs.close();
		        	pstmt.close();
		        } while(i>0);
	        	
	        	PrjInfo prjinfo = new PrjInfo();
	    		String retMsg = prjinfo.base_Confirm(AcptNo,SR_ID,tmp_obj.get("cc_lastupuser"),tmp_obj.get("reqcd"),conn);
	    		if (!retMsg.equals("0")) {
					conn.rollback();
					conn.close();
					throw new Exception("SR���ο�û�⺻ ���� ��� �� ������ �߻��Ͽ����ϴ�. �����ڿ��� �����Ͽ� �ֽñ� �ٶ��ϴ�.");
	    		}
	    		
	    		Cmr0200 cmr0200 = new Cmr0200();
				retMsg = cmr0200.request_Confirm(AcptNo,"99999",tmp_obj.get("reqcd"),tmp_obj.get("cc_lastupuser"),true,ConfList,conn);
				if (!retMsg.equals("OK")) {
					conn.rollback();
					conn.close();
					 return "����������� �� ������ �߻��Ͽ����ϴ�. �����ڿ��� �����Ͽ� �ֽñ� �ٶ��ϴ�.";
				}
			} 	
			conn.commit();
			conn.setAutoCommit(true);
			
			tmp_obj.put("SR_ID", SR_ID);
			tmp_obj.put("USER_ID", tmp_obj.get("cc_createuser"));
			tmp_obj.put("QRY_CD", tmp_obj.get("reqcd"));
			tmp_obj.put("CR_CONUSR", "updateSRInfo");//��ϵɰ����ڰ� �������̹Ƿ� SR���/���� �ÿ�  ������� ������ ����(�Լ���)������ ����.
			tmp_obj.put("CR_ACPTNO", "999999999999");
			tmp_obj.put("CR_NOTIGBN", "ED");//�Ϸ��ڵ�
//			[]:SRID, []:SR��û����, []:�������ID, []:��û�����ڵ�(CMM0020 CM_MACODE='REQUEST'), []:�������ID, []:��û��ȣ, []:�˸������ڵ�(CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����)
			String retNOTI = insertCMR9910ForNotice(tmp_obj, conn);
			ecamsLogger.error("Cmc0100.java updateSRInfo:SR���� �� CMR9910 inert �����["+retNOTI+"]");
//			 * @return String [0]:��ϿϷ�(S:SMS or C:eCAMSMSG),
//			 *                [1]:������(X),
//			 *                [2]:�˸������ȵ�(CMM0018 ���̺�,������->ȯ�漳��),
//			 *                [3]:��Ͻ���
//			 *                [70]:Exception
//			 *                [99]:SQLException
			
			tmp_obj.clear();
			
			
			conn.close();
			pstmt2 = null;
			rs = null;
			pstmt = null;
			conn = null;
			
			return SR_ID;
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.updateSRInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.updateSRInfo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.updateSRInfo() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.updateSRInfo() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.updateSRInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of updateSRInfo() method statement
	
	public String deleteSRInfo(String userid, String srid) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		HashMap<String,String> rst = new HashMap<String,String>();
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			
			strQuery.setLength(0);
			strQuery.append("UPDATE CMC0100 SET cc_status='3',cc_compdate=SYSDATE,	    \n");
			strQuery.append("       cc_lastupdate = SYSDATE,  cc_lastupuser = ?			\n");
			strQuery.append("WHERE cc_srid = ?											\n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			
			pstmt.setString(1, userid);
			pstmt.setString(2, srid);
			
			pstmt.executeUpdate();
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			pstmt.close();
			
			strQuery.setLength(0);
			strQuery.append("UPDATE CMC0110 SET cc_status='3',  \n");
			strQuery.append("       cc_closedate=SYSDATE,		\n");
			strQuery.append("       cc_lastdate = SYSDATE,		\n");
			strQuery.append("       cc_editor=?		            \n");
			strQuery.append(" WHERE	cc_srid = ?					\n");
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, userid);
			pstmt.setString(2, srid);
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			pstmt.executeUpdate();
			pstmt.close();
			
			rst = new HashMap<String,String>();
			rst.put("cc_srid", srid);
			rst.put("cc_division", "41");
			fileDelete(rst,conn);			
			conn.close();
			
			pstmt = null;
			conn = null;
			
			return "OK";
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.deleteSRInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.deleteSRInfo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.deleteSRInfo() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.deleteSRInfo() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.deleteSRInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of deleteSRInfo() method statement

	public String insertApply(HashMap<String,String> tmp_obj /*, ArrayList<HashMap<String,String>> devuser_ary*/) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet		  rs		  = null;
		StringBuffer      strQuery    = new StringBuffer();
		int 			  param_cnt	  = 1;
		int               i           = 0;
		String            inUpGubun   = "";
		
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			
			strQuery.setLength(0);
			//SR_ID count  select
//			strQuery.append("SELECT count(*) as cnt, nvl(max(cc_seqno),0)+1	as seqno\n");
			strQuery.append("SELECT count(*) as cnt                     \n");
			strQuery.append("  FROM cmc0290		                        \n");
			strQuery.append(" WHERE cc_srid = ?							\n");
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
		 	pstmt.setString(1, tmp_obj.get("cc_srid"));

			rs = pstmt.executeQuery();
			
        	if (rs.next()){
        		i = rs.getInt("cnt");

        	}			
			rs.close();
			pstmt.close();
			if ( i == 0 )
			{
				strQuery.setLength(0);
				strQuery.append("INSERT INTO CMC0290(cc_srid,   	cc_gbncd, 	cc_seqno, cc_lastdt,  cc_editor, \n");
				strQuery.append("			 	     cc_confmsg,    	cc_status)                  			 \n");
				strQuery.append("VALUES(			 ?,			  	  ?,			?,	   SYSDATE,		   ?,	 \n");
				strQuery.append("			 		 ?,                  ?)			                		     \n");

				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString());
				param_cnt = 1;				
				pstmt.setString(param_cnt++, tmp_obj.get("cc_srid"));
				pstmt.setString(param_cnt++, tmp_obj.get("cc_gbncd"));
				pstmt.setString(param_cnt++, tmp_obj.get("cc_seqno"));
				pstmt.setString(param_cnt++, tmp_obj.get("cc_editor"));
				pstmt.setString(param_cnt++, tmp_obj.get("cc_confmsg"));
				pstmt.setString(param_cnt++, tmp_obj.get("cc_status"));
				pstmt.executeUpdate();
				inUpGubun = "INSERT";
				//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				pstmt.close();
			}
			else
			{
				
	            strQuery.setLength(0);
	            strQuery.append("UPDATE CMC0290 SET                      \n");
	            strQuery.append("       CC_LASTDT =SYSDATE,CC_CONFMSG=?, \n");
	            strQuery.append("       CC_STATUS =?                     \n");
	            strQuery.append(" WHERE CC_SRID=?                        \n");//
	        	pstmt = conn.prepareStatement(strQuery.toString());
			    pstmt.setString(1, tmp_obj.get("cc_confmsg"));
			    pstmt.setString(2, tmp_obj.get("cc_status"));
			    pstmt.setString(3, tmp_obj.get("cc_srid"));
	        	pstmt.executeUpdate();
	        	inUpGubun = "UPDATE";
	        	pstmt.close();
        	}

			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			
//			return SR_ID;
			return inUpGubun;
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.insertApply() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.insertPrjInfo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.insertApply() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.insertApply() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.insertApply() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of insertPrjInfo() method statement	
	public String getRelatSR(String baseSR) throws SQLException, Exception {
		Connection        conn        = null;
		ResultSet		  rs		  = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();	
		String            retCD       = "NO";
		try {
			conn = connectionContext.getConnection();
			
			strQuery.setLength(0);
			strQuery.append("select count(*) cnt from cmc0102   \n");
			strQuery.append(" where cc_srid=?                   \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, baseSR);
			rs = pstmt.executeQuery();
			if (rs.next()) {
				if (rs.getInt("cnt")>0) retCD = "OK";
				else retCD = "NO";
			}
			rs.close();
			pstmt.close();
			
			conn.close();
			pstmt = null;
			conn = null;
			
			return retCD;
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getRelatSR() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getRelatSR() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getRelatSR() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getRelatSR() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)  try{rs.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getRelatSR() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getSRRelat() method statement
	public Object[] getAcptRelat(String baseSR) throws SQLException, Exception {
		Connection        conn        = null;
		ResultSet		  rs		  = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();	
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;	
		
		try {
			conn = connectionContext.getConnection();
			
			rsval.clear();
			strQuery.setLength(0);
			strQuery.append("select a.cr_acptno,a.cr_passcd,                            \n");
			strQuery.append("       to_char(a.cr_acptdate,'yyyy/mm/dd hh24:mi') acptdate,\n");
			strQuery.append("       to_char(a.cr_prcdate,'yyyy/mm/dd hh24:mi') prcdate, \n");
			strQuery.append("       b.cm_username,c.cm_deptname                         \n");
			strQuery.append("  from cmc0102 f,cmm0100 c,cmm0040 b,cmr1000 a             \n");
			strQuery.append(" where f.cc_srid=? and f.cc_gbncd='RB'                     \n");
			strQuery.append("   and f.cc_relatid=a.cr_acptno                            \n");
			strQuery.append("   and a.cr_editor=b.cm_userid                             \n");
			strQuery.append("   and a.cr_teamcd=c.cm_deptcd                             \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, baseSR);
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			while (rs.next()) {
				rst = new HashMap<String, String>();
				rst.put("cr_acptno", rs.getString("cr_acptno"));
				rst.put("acptdate", rs.getString("acptdate"));
				rst.put("prcdate", rs.getString("prcdate"));
				rst.put("acptno", rs.getString("cr_acptno").substring(0,4)+"-"+
					              rs.getString("cr_acptno").substring(4,6)+"-"+
					              rs.getString("cr_acptno").substring(6));
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("cm_deptname", rs.getString("cm_deptname"));
				rst.put("cr_passcd", rs.getString("cr_passcd"));
				rsval.add(rst);
				rst = null;
			}
			rs.close();
			pstmt.close();
			
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			
			return rsval.toArray();
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getSRRelat() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getSRRelat() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getSRRelat() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getSRRelat() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rst != null) 	rst = null;
			if (rsval != null) 	rsval = null;
			if (rs != null)  try{rs.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getSRRelat() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getSRRelat() method statement
	public Object[] getBackList(HashMap<String, String> etcData) throws SQLException, Exception {
		Connection        conn        = null;
		ResultSet		  rs		  = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();	
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;
		int               paramIndex  = 0;
		
		try {
			conn = connectionContext.getConnection();
			
			rsval.clear();
			strQuery.setLength(0);
			strQuery.append("select a.cr_acptno,a.cr_passcd,                            \n");
			strQuery.append("       to_char(a.cr_acptdate,'yyyy/mm/dd hh24:mi') acptdate,\n");
			strQuery.append("       to_char(a.cr_prcdate,'yyyy/mm/dd hh24:mi') prcdate, \n");
			strQuery.append("       b.cm_username,c.cm_deptname                         \n");
			strQuery.append("  from cmm0100 c,cmm0040 b,cmr1000 a                       \n");
			strQuery.append(" where a.cr_qrycd='06' and a.cr_status<>'3'                \n");
			strQuery.append("   and a.cr_relatno is null                                \n");
			strQuery.append("   and to_char(a.cr_acptdate,'yyyymmdd')>=?                \n");
			strQuery.append("   and to_char(a.cr_acptdate,'yyyymmdd')<=?                \n");
			if (etcData.get("qrycd") != null && !etcData.get("qrycd").equals("")) {
				if (etcData.get("qrycd").equals("01")) {
					strQuery.append("and b.cm_username=?                                \n");
				}
			}
			strQuery.append("   and a.cr_editor=b.cm_userid                             \n");
			strQuery.append("   and a.cr_teamcd=c.cm_deptcd                             \n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(++paramIndex, etcData.get("stday"));
        	pstmt.setString(++paramIndex, etcData.get("edday"));
			if (etcData.get("qrycd") != null && !etcData.get("qrycd").equals("")) {
				if (etcData.get("qrycd").equals("01")) {
					pstmt.setString(++paramIndex, etcData.get("qrytxt"));
				}
			}
			rs = pstmt.executeQuery();
			while (rs.next()) {
				rst = new HashMap<String, String>();
				rst.put("cr_acptno", rs.getString("cr_acptno"));
				rst.put("acptdate", rs.getString("acptdate"));
				rst.put("prcdate", rs.getString("prcdate"));
				rst.put("acptno", rs.getString("cr_acptno").substring(0,4)+"-"+
					              rs.getString("cr_acptno").substring(4,6)+"-"+
					              rs.getString("cr_acptno").substring(6));
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("cm_deptname", rs.getString("cm_deptname"));
				rst.put("cr_passcd", rs.getString("cr_passcd"));
				rsval.add(rst);
				rst = null;
			}
			rs.close();
			pstmt.close();
			
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			
			return rsval.toArray();
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getSRRelat() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getSRRelat() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getSRRelat() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getSRRelat() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rst != null) 	rst = null;
			if (rsval != null) 	rsval = null;
			if (rs != null)  try{rs.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getSRRelat() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getSRRelat() method statement
	public Object[] getSRRelat(String baseSR) throws SQLException, Exception {
		Connection        conn        = null;
		ResultSet		  rs		  = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
//		boolean           insSw       = true;
		ConnectionContext connectionContext = new ConnectionResource();	
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;	
		
		try {
			conn = connectionContext.getConnection();
			
			rsval.clear();
			strQuery.setLength(0);
			strQuery.append("select a.cc_srid,a.cc_reqtitle,                            \n");
			strQuery.append("       to_char(a.cc_createdate,'yyyy/mm/dd') reqday,       \n");
//			strQuery.append("       a.cc_reqcompdate,b.cm_username requser,             \n");
			strQuery.append("       a.cc_reqcompdate,             \n");
			strQuery.append("       c.cm_deptname reqdept,                              \n");
			strQuery.append("       d.cm_codename cattype,                              \n");
			strQuery.append("       e.cm_codename chgtype                               \n");
			strQuery.append("  from (select cm_micode,cm_codename from cmm0020 where cm_macode='CATTYPE') d,  \n");
			strQuery.append("       (select cm_micode,cm_codename from cmm0020 where cm_macode='CHGTYPE') e,  \n");
//			strQuery.append("       cmc0102 f,cmm0100 c,cmm0040 b,cmc0100 a             \n");
			strQuery.append("       cmc0102 f,cmm0100 c,cmc0100 a             \n");
			strQuery.append(" where f.cc_srid=? and f.cc_gbncd='SR'                     \n");
			strQuery.append("   and f.cc_relatid=a.cc_srid                              \n");
//			strQuery.append("   and a.cc_requser=b.cm_userid                            \n");
			strQuery.append("   and a.cc_reqdept=c.cm_deptcd                            \n");
			strQuery.append("   and a.cc_cattype=d.cm_micode(+)                         \n");
			strQuery.append("   and a.cc_chgtype=e.cm_micode(+)                         \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, baseSR);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				rst = new HashMap<String, String>();
				rst.put("cc_srid", rs.getString("cc_srid"));
				rst.put("createdate", rs.getString("reqday"));
				if (rs.getString("cc_reqcompdate") != null) {
					rst.put("reqcompdat", rs.getString("cc_reqcompdate").substring(0,4)+"/"+
						              rs.getString("cc_reqcompdate").substring(4,6)+"/"+
						              rs.getString("cc_reqcompdate").substring(6));
				}
//				rst.put("requser", rs.getString("requser"));
				rst.put("requser", "");
				rst.put("reqdept", rs.getString("reqdept"));
				rst.put("cattype", rs.getString("cattype"));
				rst.put("chgtype", rs.getString("chgtype"));
				rst.put("cc_reqtitle", rs.getString("cc_reqtitle"));
				rsval.add(rst);
				rst = null;
			}
			rs.close();
			pstmt.close();
			
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			
			return rsval.toArray();
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getSRRelat() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.getSRRelat() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.getSRRelat() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.getSRRelat() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rst != null) 	rst = null;
			if (rsval != null) 	rsval = null;
			if (rs != null)  try{rs.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.getSRRelat() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getSRRelat() method statement
	public String updtSRRelat(String baseSR, String relatSR, String userid,String gbncd) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			
			strQuery.setLength(0);
			if (gbncd.equals("A")) {
				strQuery.append("insert into cmc0102          \n");
				strQuery.append("   (cc_srid,cc_gbncd,cc_relatid,cc_creatdt,cc_editor)  \n");
				strQuery.append("values (?,'SR',?,SYSDATE,?)  \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, baseSR);
				pstmt.setString(2, relatSR);
				pstmt.setString(3, userid);
			} else {
				strQuery.append("delete cmc0102              \n");
				strQuery.append(" where cc_srid=?            \n");
				strQuery.append("   and cc_relatid=?         \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, baseSR);
				pstmt.setString(2, relatSR);
			}
			pstmt.executeUpdate();
			pstmt.close();
			
			conn.close();
			pstmt = null;
			conn = null;
			
			return "OK";
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.updtSRRelat() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.updtSRRelat() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.updtSRRelat() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.updtSRRelat() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.updtSRRelat() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of updtSRRelat() method statement

	public String updtAcptRelat(String baseSR, String relatAcpt, String userid,String gbncd) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			
			strQuery.setLength(0);
			if (gbncd.equals("A")) {
				strQuery.append("insert into cmc0102          \n");
				strQuery.append("   (cc_srid,cc_gbncd,cc_relatid,cc_creatdt,cc_editor)  \n");
				strQuery.append("values (?,'RB',?,SYSDATE,?)  \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, baseSR);
				pstmt.setString(2, relatAcpt);
				pstmt.setString(3, userid);
			} else {
				strQuery.append("delete cmc0102              \n");
				strQuery.append(" where cc_srid=?            \n");
				strQuery.append("   and cc_relatid=?         \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, baseSR);
				pstmt.setString(2, relatAcpt);
			}
			pstmt.executeUpdate();
			pstmt.close();
			
			strQuery.setLength(0);
			if (gbncd.equals("A")) {
				strQuery.append("update cmr1000 set cr_relatno=? \n");
				strQuery.append(" where cr_acptno=?           \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, baseSR);
				pstmt.setString(2, relatAcpt);
			} else {
				strQuery.append("update cmr1000 set cr_relatno='' \n");
				strQuery.append(" where cr_acptno=?           \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, relatAcpt);
			}
			pstmt.executeUpdate();
			pstmt.close();
			
			conn.close();
			pstmt = null;
			conn = null;
			
			return "OK";
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.updtSRRelat() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmc0100.updtSRRelat() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.updtSRRelat() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmc0100.updtSRRelat() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.updtSRRelat() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of updtSRRelat() method statement
	

	/** �˸��� ���� insert CMR9910 �۾� 
	 * @param param : [SR_ID]:SRID,
	 *                [SR_TITLE]:SR��û����,
	 *                [USER_ID]:�������ID,
	 *                [QRY_CD]:��û�����ڵ�(CMM0020 CM_MACODE='REQUEST'),
	 *                [CR_CONUSR]:�������ID(��, QRY_CD���� 41(SR���)�� ��� ��ϵɰ����ڰ� �������̹Ƿ� ���(insertSRInfo)/����(updateSRInfo) ����(�Լ���)������ ����,
	 *                [CR_ACPTNO]:��û��ȣ,
	 *                [CR_NOTIGBN]:�˸������ڵ�(CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����)
	 * @param conn : eCAMS DB Connection
	 * @author 20141029 neo
	 * @return String [0]:��ϿϷ�(S:SMS or C:eCAMSMSG),
	 *                [1]:������(X),
	 *                [2]:�˸������ȵ�(CMM0018 ���̺�,������->ȯ�漳��),
	 *                [3]:��Ͻ���
	 *                [70]:Exception
	 *                [99]:SQLException
	 * @throws SQLException
	 * @throws Exception
	 */
	public String insertCMR9910ForNotice(HashMap<String, String> param,Connection conn) throws SQLException, Exception {
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2      = null;
		ResultSet		  rs		  = null;
		StringBuffer      strQuery    = new StringBuffer();
		String 			  CR_CONUSR   = "";//�˸����������ȣ
		String 			  CR_ACPTNO	  = "";//��û��ȣ
		String 			  CR_NOTIGBN  = "";//�˸������ڵ�[CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����]
		String 			  CR_TITILE   = "";//�˸�����
		String 			  CR_LINKURL  = "";//LINK URL
		String 			  SR_ID		  = "";
		String 			  SR_TITLE    = "";
		String 			  QRY_CD	  = "";//��û�����ڵ�
		String            REQDATE     = "";//��û��(���ó�¥ YYYY/MM/DD)
		String 			  USER_ID     = "";//������� �����ȣ 
		boolean           SMSYN       = false;
		boolean           eCAMSMsgYN  = false;
		boolean           holidayYN   = false;//���Ͽ���(������ �ð��� ���Ϸ� ����)
		StringBuffer	  msgContent  = new StringBuffer(); //�˸��޼��� ����
		int				  paramIndex  = 0;
		String            retString   = "2";
		
		try {

			SR_ID = param.get("SR_ID");
			SR_TITLE = param.get("SR_TITLE");
			USER_ID = param.get("USER_ID");
			QRY_CD = param.get("QRY_CD");
			CR_CONUSR = param.get("CR_CONUSR");
			CR_ACPTNO = param.get("CR_ACPTNO");
			CR_NOTIGBN = param.get("CR_NOTIGBN");

			
			//CMR9910 insert ��� ���� CMM0018 ���̺��� ��ȸ.(��, �������� �Ѵ� X ���� ������)	
			Holiday_Check holidayCheck = new Holiday_Check();
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			Calendar calendar = Calendar.getInstance();
			ecamsLogger.error( "��������:"+sdf.format(calendar.getTime()) );
			
			//���������� �ƴ��� üũ
			if ( holidayCheck.chkBusinessDay(sdf.format(calendar.getTime())) == 0 ) {
				//����ð��� ���������� �ƴ��� üũ
				strQuery.setLength(0);
				strQuery.append("select a.cm_sttime,a.cm_edtime,          \n");
				strQuery.append("       to_char(SYSDATE,'hh24mi') nowhhmm \n");
				strQuery.append("  from cmm0014 a                         \n");
				strQuery.append(" where a.cm_stno='ECAMS'                 \n");
				strQuery.append("   and decode(to_char(SYSDATE,'d'),1,'03',6,'02',7,'03','01') = a.cm_timecd \n");
				pstmt = conn.prepareStatement(strQuery.toString());
	            rs = pstmt.executeQuery();
	            if ( rs.next() ){
	            	//����ð��� ��ϵ� �ð��ܿ� ������
					if (Integer.parseInt(rs.getString("nowhhmm")) < Integer.parseInt(rs.getString("cm_sttime")) ||
						Integer.parseInt(rs.getString("nowhhmm")) > Integer.parseInt(rs.getString("cm_edtime"))){
						holidayYN = true;
					}
				}
				rs.close();
				pstmt.close();
			} else {
				holidayYN = true;
			}
			
			//SMS�� �� ������¥ ����
			sdf = new SimpleDateFormat("yyyy/MM/dd");
			REQDATE = sdf.format(calendar.getTime());
			
			
			//eCAMS URL ��ȸ
			strQuery.setLength(0);
			strQuery.append("SELECT CM_URL \n");
			strQuery.append("  FROM CMM0010 \n");
			strQuery.append(" WHERE CM_STNO = 'ECAMS' \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			rs = pstmt.executeQuery();
			if( rs.next() ){
				CR_LINKURL = rs.getString("CM_URL");
			}
			rs.close();
			pstmt.close();
			
			
			//CMM0018 ���̺� ��ȸ
			int reRowCnt = 0;
			strQuery.setLength(0);
			if ( holidayYN ){//�����϶�
				strQuery.append("SELECT CM_HOLIDAY as noitType \n");
			} else {
				strQuery.append("SELECT CM_COMMON as noitType \n");
			}
			strQuery.append("  FROM CMM0018 \n");
			strQuery.append(" WHERE CM_QRYCD = ? \n");//��û�����ڵ�
			strQuery.append("   AND CM_NOTIGBN = ? \n");
//			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, QRY_CD);//��û�����ڵ�
			pstmt.setString(2, CR_NOTIGBN);//�˸������ڵ�
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			while( rs.next() ){//������ X:������,S:SMS,C:eCAMS
				if ( rs.getString("noitType").equals("S") ){
					SMSYN = true;
				} else if ( rs.getString("noitType").equals("C") ){
					eCAMSMsgYN = true;
				}
				++reRowCnt;
			}
			//��ȸ ����� �ִ��� Ȯ�� �� ����� ������ ���� 2:��Ͼȵ�
			//����� ������ row�� index�� Ȯ���ؼ� 0�̸� �������.
			if ( reRowCnt == 0 ){
				return "2";
			}
			//��ȸ ������� �Ѵ� X ������ ��ϵ� ��� ���� 1:������
			if ( SMSYN && eCAMSMsgYN ) {
				return "1";
			}
			rs.close();
			pstmt.close();
			
			
			//��û���п� ���� ���ó��
			if ( "41".equals( QRY_CD ) ) {//SR��� �϶�. ����� + �����Ȱ�����
				
				CR_TITILE = "��������ý��� SR���";
				
				//SR����ڸ� ���� CMR9910 insert
//				CR_CONUSR	VARCHAR2(10)	Not Null	�˸����������ȣ
//				CR_SENDDATE	DATE	Not Null	�����Ͻ�
//				CR_STATUS	CHAR(1)		����(0:��Ȯ��,9:Ȯ��)
//				CR_SENDUSR	VARCHAR2(10)		������� �����ȣ
//				CR_CONFDATE	DATE		Ȯ���Ͻ�
//				CR_SGNMSG	VARCHAR2(1000)		��������
//				CR_ACPTNO	CHAR(12)	Not Null	��û��ȣ
//				CR_TITLE	VARCHAR2(200)		�˸�����
//				CR_LINKURL	VARCHAR2(200)		LINK URL
//				CR_NOTIGBN	CHAR(2)		CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����
//				CR_SMSMSG	VARCHAR2(100)		SMS���۳���
				strQuery.setLength(0);
				strQuery.append("INSERT INTO CMR9910 (CR_CONUSR, CR_SENDDATE, CR_STATUS, CR_SENDUSR,	\n");			
				strQuery.append("					  CR_SGNMSG, CR_ACPTNO, CR_TITLE, CR_LINKURL,		\n");			
				strQuery.append("					  CR_NOTIGBN, CR_SMSMSG)       		                \n");
				strQuery.append("values (?,SYSDATE,'0',?   ,?,?,?,?   ,?,?)\n");
//				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt = new LoggableStatement(conn,strQuery.toString());
				paramIndex = 0;
				pstmt.setString(++paramIndex, USER_ID); //�޴»��
				pstmt.setString(++paramIndex, USER_ID); //�������
				//eCAMS�˸� ���� �ۼ� ����
				msgContent.setLength(0);
				if ( eCAMSMsgYN ){
					msgContent.append("1. SR-ID  : " + SR_ID + "\r\n");
					msgContent.append("2. ��û���� : " + SR_TITLE + "\r\n");
					if ( CR_CONUSR.equals("insertSRInfo") ){
						msgContent.append("3. ���� : �䱸����(SR) ��� �Ϸ�" + "\r\n");
					} else {
						msgContent.append("3. ���� : �䱸����(SR) ���� �Ϸ�" + "\r\n");
					}
					msgContent.append("   ��������ý���(eCAMS)�� �����Ͽ� [SR��Ȳ]ȭ�鿡��" + "\r\n");
					msgContent.append("   Ȯ���Ͽ� �ֽñ� �ٶ��ϴ�." );
				}
				//eCAMS�˸� ���� �ۼ� ��
				pstmt.setString(++paramIndex, msgContent.toString()); //cr_sgnmsg - �˸��޽��� ����
				pstmt.setString(++paramIndex, CR_ACPTNO); //��û��ȣ 999999999999
				pstmt.setString(++paramIndex, CR_TITILE); //cr_title - �˸��޼��� Ÿ��Ʋ
				pstmt.setString(++paramIndex, CR_LINKURL); //cr_linkurl - ��ũ URL
				pstmt.setString(++paramIndex, CR_NOTIGBN); //CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����
				//SMS���ڳ��� �ۼ� ����
				msgContent.setLength(0);
				if ( SMSYN ){
					if ( CR_CONUSR.equals("insertSRInfo") ){
						msgContent.append("SR���"+"\r\n");
					} else {
						msgContent.append("SR����"+"\r\n");
					}
					msgContent.append("��û��:" + REQDATE + "\r\n");
					msgContent.append("SR-ID:" + SR_ID);
				}
				//SMS���ڳ��� �ۼ� ��
				pstmt.setString(++paramIndex, msgContent.toString()); //SMS���ڳ���
				ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				pstmt.executeUpdate();
				pstmt.close();
				
				
				//SR�� ��ϵ� �����ڸ� ���� CMR9910 insert
				strQuery.setLength(0);
				strQuery.append("INSERT INTO CMR9910 (CR_CONUSR, CR_SENDDATE, CR_STATUS, CR_SENDUSR,	\n");			
				strQuery.append("					  CR_SGNMSG, CR_ACPTNO, CR_TITLE, CR_LINKURL,		\n");			
				strQuery.append("					  CR_NOTIGBN, CR_SMSMSG)       		                \n");
				strQuery.append("                    (select b.cc_userid, SYSDATE, '0', a.cc_createuser, \n");
				strQuery.append("                            ?,?,?,?,   ?,? \n");
				strQuery.append("                       from cmc0100 a, cmc0110 b \n");
				strQuery.append("                      where a.cc_srid = b.cc_srid \n");
				strQuery.append("                        and a.cc_srid = ? \n");
				strQuery.append("                        and b.cc_userid <> a.cc_createuser \n");
				strQuery.append("                        and b.cc_status <> '3') \n");
//				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt = new LoggableStatement(conn,strQuery.toString());
				paramIndex = 0;
				//eCAMS�˸� ���� �ۼ� ����
				msgContent.setLength(0);
				if ( eCAMSMsgYN ){
					msgContent.append("1. SR-ID  : " + SR_ID + "\r\n");
					msgContent.append("2. ��û���� : " + SR_TITLE + "\r\n");
					if ( CR_CONUSR.equals("insertSRInfo") ){
						msgContent.append("3. ���� : �䱸����(SR) ��簳���� ��� �Ϸ�" + "\r\n");
					} else {
						msgContent.append("3. ���� : �䱸����(SR) ���� ���� �Ϸ�" + "\r\n");
					}
					msgContent.append("   ��������ý���(eCAMS)�� �����Ͽ� [SR��Ȳ]ȭ�鿡��" + "\r\n");
					msgContent.append("   Ȯ���Ͽ� �ֽñ� �ٶ��ϴ�." );
				}
				//eCAMS�˸� ���� �ۼ� ��
				pstmt.setString(++paramIndex, msgContent.toString()); //cr_sgnmsg - �˸��޽��� ����
				pstmt.setString(++paramIndex, CR_ACPTNO); //��û��ȣ 999999999999
				pstmt.setString(++paramIndex, CR_TITILE); //cr_title - �˸��޼��� Ÿ��Ʋ
				pstmt.setString(++paramIndex, CR_LINKURL); //cr_linkurl - ��ũ URL
				pstmt.setString(++paramIndex, CR_NOTIGBN); //CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����
				//SMS���ڳ��� �ۼ� ����
				msgContent.setLength(0);
				if ( SMSYN ){
					if ( CR_CONUSR.equals("insertSRInfo") ){
						msgContent.append("SR��簳���� ���"+"\r\n");
					} else {
						msgContent.append("SR��簳���� ����"+"\r\n");
					}
					msgContent.append("��û��:" + REQDATE + "\r\n");
					msgContent.append("SR-ID:" + SR_ID);
				}
				//SMS���ڳ��� �ۼ� ��
				pstmt.setString(++paramIndex, msgContent.toString()); //SMS���ڳ���
				pstmt.setString(++paramIndex, SR_ID); //SR_ID
				ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				pstmt.executeUpdate();
				pstmt.close();
				
				retString = "0";
				
			} else if ( "54".equals( QRY_CD ) ) {//SR��� �϶�. ����� + �����Ȱ�����
				
				CR_TITILE = "��������ý��� ���߰˼�";
				
				//�޴»�� ��ȸ
				//���߰˼� ��û => QA
				//���߰˼� �Ϸ�/�ݷ� => ��û��
				
				if ( "CO".equals(CR_NOTIGBN) ){
					
					strQuery.setLength(0);
					strQuery.append("SELECT A.CM_USERID, A.CM_USERNAME \n");
					strQuery.append("  FROM CMM0040 A, CMM0043 B \n");
					strQuery.append(" WHERE B.CM_RGTCD='58' \n");
					strQuery.append("   AND A.CM_USERID = B.CM_USERID \n");
					strQuery.append("   AND A.CM_ACTIVE = '1' \n");
	//				pstmt2 = conn.prepareStatement(strQuery.toString());
					pstmt2 = new LoggableStatement(conn,strQuery.toString());
					ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
					rs = pstmt2.executeQuery();
					while( rs.next() ){
						//SR����ڸ� ���� CMR9910 insert
						strQuery.setLength(0);
						strQuery.append("INSERT INTO CMR9910 (CR_CONUSR, CR_SENDDATE, CR_STATUS, CR_SENDUSR,	\n");
						strQuery.append("					  CR_SGNMSG, CR_ACPTNO, CR_TITLE, CR_LINKURL,		\n");
						strQuery.append("					  CR_NOTIGBN, CR_SMSMSG)       		                \n");
						strQuery.append("values (?,SYSDATE,'0',?   ,?,?,?,?   ,?,?)\n");
	//					pstmt = conn.prepareStatement(strQuery.toString());
						pstmt = new LoggableStatement(conn,strQuery.toString());
						paramIndex = 0;
						pstmt.setString(++paramIndex, rs.getString("CM_USERID") ); //�޴»��
						pstmt.setString(++paramIndex, USER_ID ); //�������
						//eCAMS�˸� ���� �ۼ� ����
						msgContent.setLength(0);
						if ( eCAMSMsgYN ){
							msgContent.append("1. SR-ID  : " + SR_ID + "\r\n");
							msgContent.append("2. ��û���� : " + SR_TITLE + "\r\n");
							//�˸�����(NOTIGBN) [CO]����˸�,[ED]�Ϸ�˸�,[CN]�ݷ��˸�,[ER]�����˸�
							if ( "CO".equals(CR_NOTIGBN) ){
								msgContent.append("3. ���� : ���߰˼� ��û" + "\r\n");
							} else if ( "ED".equals(CR_NOTIGBN) ){
								msgContent.append("3. ���� : ���߰˼� �Ϸ�" + "\r\n");
							} else {
								msgContent.append("3. ���� : ���߰˼� �ݷ�" + "\r\n");
							}
							msgContent.append("   ��������ý���(eCAMS)�� �����Ͽ�" + "\r\n");
							msgContent.append("   Ȯ���Ͽ� �ֽñ� �ٶ��ϴ�." );
						}
						//eCAMS�˸� ���� �ۼ� ��
						pstmt.setString(++paramIndex, msgContent.toString()); //cr_sgnmsg - �˸��޽��� ����
						pstmt.setString(++paramIndex, CR_ACPTNO); //��û��ȣ 999999999999
						pstmt.setString(++paramIndex, CR_TITILE); //cr_title - �˸��޼��� Ÿ��Ʋ
						pstmt.setString(++paramIndex, CR_LINKURL); //cr_linkurl - ��ũ URL
						pstmt.setString(++paramIndex, CR_NOTIGBN); //CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����
						//SMS���ڳ��� �ۼ� ����
						msgContent.setLength(0);
						if ( SMSYN ){
							//�˸�����(NOTIGBN) [CO]����˸�,[ED]�Ϸ�˸�,[CN]�ݷ��˸�,[ER]�����˸�
							if ( "CO".equals(CR_NOTIGBN) ){
								msgContent.append("���߰˼� ��û"+"\r\n");
							} else if ( "ED".equals(CR_NOTIGBN) ){
								msgContent.append("���߰˼� �Ϸ�"+"\r\n");
							} else {
								msgContent.append("���߰˼� �ݷ�"+"\r\n");
							}
							msgContent.append("��û��:" + REQDATE + "\r\n");
							msgContent.append("SR-ID:" + SR_ID);
						}
						//SMS���ڳ��� �ۼ� ��
						pstmt.setString(++paramIndex, msgContent.toString()); //SMS���ڳ���
						ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
						pstmt.executeUpdate();
						pstmt.close();
					}
					rs.close();
					pstmt2.close();
					
				} else if ( "ED".equals(CR_NOTIGBN) ){
					
					//SR����ڸ� ���� CMR9910 insert
					strQuery.setLength(0);
					strQuery.append("INSERT INTO CMR9910 (CR_CONUSR, CR_SENDDATE, CR_STATUS, CR_SENDUSR,	\n");
					strQuery.append("					  CR_SGNMSG, CR_ACPTNO, CR_TITLE, CR_LINKURL,		\n");
					strQuery.append("					  CR_NOTIGBN, CR_SMSMSG)       		                \n");
					strQuery.append("values (?,SYSDATE,'0',?   ,?,?,?,?   ,?,?)\n");
//					pstmt = conn.prepareStatement(strQuery.toString());
					pstmt = new LoggableStatement(conn,strQuery.toString());
					paramIndex = 0;
					pstmt.setString(++paramIndex, USER_ID ); //�޴»��
					pstmt.setString(++paramIndex, CR_CONUSR ); //�������
					//eCAMS�˸� ���� �ۼ� ����
					msgContent.setLength(0);
					if ( eCAMSMsgYN ){
						msgContent.append("1. SR-ID  : " + SR_ID + "\r\n");
						msgContent.append("2. ��û���� : " + SR_TITLE + "\r\n");
						//�˸�����(NOTIGBN) [CO]����˸�,[ED]�Ϸ�˸�,[CN]�ݷ��˸�,[ER]�����˸�
						if ( "CO".equals(CR_NOTIGBN) ){
							msgContent.append("3. ���� : ���߰˼� ��û" + "\r\n");
						} else if ( "ED".equals(CR_NOTIGBN) ){
							msgContent.append("3. ���� : ���߰˼� �Ϸ�" + "\r\n");
						} else {
							msgContent.append("3. ���� : ���߰˼� �ݷ�" + "\r\n");
						}
						msgContent.append("   ��������ý���(eCAMS)�� �����Ͽ�" + "\r\n");
						msgContent.append("   Ȯ���Ͽ� �ֽñ� �ٶ��ϴ�." );
					}
					//eCAMS�˸� ���� �ۼ� ��
					pstmt.setString(++paramIndex, msgContent.toString()); //cr_sgnmsg - �˸��޽��� ����
					pstmt.setString(++paramIndex, CR_ACPTNO); //��û��ȣ 999999999999
					pstmt.setString(++paramIndex, CR_TITILE); //cr_title - �˸��޼��� Ÿ��Ʋ
					pstmt.setString(++paramIndex, CR_LINKURL); //cr_linkurl - ��ũ URL
					pstmt.setString(++paramIndex, CR_NOTIGBN); //CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����
					//SMS���ڳ��� �ۼ� ����
					msgContent.setLength(0);
					if ( SMSYN ){
						//�˸�����(NOTIGBN) [CO]����˸�,[ED]�Ϸ�˸�,[CN]�ݷ��˸�,[ER]�����˸�
						if ( "CO".equals(CR_NOTIGBN) ){
							msgContent.append("���߰˼� ��û"+"\r\n");
						} else if ( "ED".equals(CR_NOTIGBN) ){
							msgContent.append("���߰˼� �Ϸ�"+"\r\n");
						} else {
							msgContent.append("���߰˼� �ݷ�"+"\r\n");
						}
						msgContent.append("��û��:" + REQDATE + "\r\n");
						msgContent.append("SR-ID:" + SR_ID);
					}
					//SMS���ڳ��� �ۼ� ��
					pstmt.setString(++paramIndex, msgContent.toString()); //SMS���ڳ���
					ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
					pstmt.executeUpdate();
					pstmt.close();
					
				} else {
					
					//SR����ڸ� ���� CMR9910 insert
					strQuery.setLength(0);
					strQuery.append("INSERT INTO CMR9910 (CR_CONUSR, CR_SENDDATE, CR_STATUS, CR_SENDUSR,	\n");
					strQuery.append("					  CR_SGNMSG, CR_ACPTNO, CR_TITLE, CR_LINKURL,		\n");
					strQuery.append("					  CR_NOTIGBN, CR_SMSMSG)       		                \n");
					strQuery.append("values (?,SYSDATE,'0',?   ,?,?,?,?   ,?,?)\n");
//					pstmt = conn.prepareStatement(strQuery.toString());
					pstmt = new LoggableStatement(conn,strQuery.toString());
					paramIndex = 0;
					pstmt.setString(++paramIndex, USER_ID ); //�޴»��
					pstmt.setString(++paramIndex, CR_CONUSR ); //�������
					//eCAMS�˸� ���� �ۼ� ����
					msgContent.setLength(0);
					if ( eCAMSMsgYN ){
						msgContent.append("1. SR-ID  : " + SR_ID + "\r\n");
						msgContent.append("2. ��û���� : " + SR_TITLE + "\r\n");
						//�˸�����(NOTIGBN) [CO]����˸�,[ED]�Ϸ�˸�,[CN]�ݷ��˸�,[ER]�����˸�
						if ( "CO".equals(CR_NOTIGBN) ){
							msgContent.append("3. ���� : ���߰˼� ��û" + "\r\n");
						} else if ( "ED".equals(CR_NOTIGBN) ){
							msgContent.append("3. ���� : ���߰˼� �Ϸ�" + "\r\n");
						} else {
							msgContent.append("3. ���� : ���߰˼� �ݷ�" + "\r\n");
						}
						msgContent.append("   ��������ý���(eCAMS)�� �����Ͽ�" + "\r\n");
						msgContent.append("   Ȯ���Ͽ� �ֽñ� �ٶ��ϴ�." );
					}
					//eCAMS�˸� ���� �ۼ� ��
					pstmt.setString(++paramIndex, msgContent.toString()); //cr_sgnmsg - �˸��޽��� ����
					pstmt.setString(++paramIndex, CR_ACPTNO); //��û��ȣ 999999999999
					pstmt.setString(++paramIndex, CR_TITILE); //cr_title - �˸��޼��� Ÿ��Ʋ
					pstmt.setString(++paramIndex, CR_LINKURL); //cr_linkurl - ��ũ URL
					pstmt.setString(++paramIndex, CR_NOTIGBN); //CO:����,ED:�Ϸ�,CN:�ݷ�,ER:����
					//SMS���ڳ��� �ۼ� ����
					msgContent.setLength(0);
					if ( SMSYN ){
						//�˸�����(NOTIGBN) [CO]����˸�,[ED]�Ϸ�˸�,[CN]�ݷ��˸�,[ER]�����˸�
						if ( "CO".equals(CR_NOTIGBN) ){
							msgContent.append("���߰˼� ��û��"+"\r\n");
						} else if ( "ED".equals(CR_NOTIGBN) ){
							msgContent.append("���߰˼� �Ϸ��"+"\r\n");
						} else {
							msgContent.append("���߰˼� �ݷ���"+"\r\n");
						}
						msgContent.append("��û��:" + REQDATE + "\r\n");
						msgContent.append("SR-ID:" + SR_ID);
					}
					//SMS���ڳ��� �ۼ� ��
					pstmt.setString(++paramIndex, msgContent.toString()); //SMS���ڳ���
					ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
					pstmt.executeUpdate();
					pstmt.close();
					
				}
				
				retString = "0";
				
			}
			
			rs = null;
			pstmt = null;
		
			return retString;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() SQLException END ##");
			return "99";
			//throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() Exception END ##");
			return "70";
			//throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null) 	try{rs.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
		}
	}//end of insertMoiraSRInfo() method statement
	
	
	public static String insertMoiraSRInfo(HashMap<String, String> param) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2       = null;
		ResultSet		  rs		  = null;
		ResultSet		  rs2		  = null;
		StringBuffer      strQuery    = new StringBuffer();
		String 			  SR_ID		  = "";
		String 			  User_ID  = "";		
		String 			  cc_devdept  = "";
		String 			  cc_reqdept  = "";
		String			  cc_reqdate = "";
		String			  cc_reqcompdate = "";
		final String	  msgTitle = "��������ý��� SR��� ���� �߻� �˸�"; //�˸��޼��� ����
		final String	  msgURL = "eacms_win_flex/eCAMSBase.jsp"; //��ũ URL�� �⺻URL �ڿ� ���� �ּ�
		StringBuffer	  msgContent = new StringBuffer(); //�˸��޼��� ����
		int				  pstmtcount  = 0;
		ConnectionContext connectionContext = new ConnectionResource();		
		
		try {
			conn = connectionContext.getConnection();
			
//			ecamsLogger.error("snm="+param.get("snm"));
//			ecamsLogger.error("rdpt="+param.get("rdpt"));
//			ecamsLogger.error("sdpt="+param.get("sdpt"));
//			ecamsLogger.error("odt="+param.get("odt"));
//			ecamsLogger.error("sdt="+param.get("sdt"));
//			ecamsLogger.error("subj="+param.get("subj"));
			
			strQuery.setLength(0);
			//SR_ID �ְ��� ���Ͽ� ���ο� SR_ID�� ����
			strQuery.append("SELECT lpad(to_number(nvl(max(substr(cc_srid,9,11)),'0'))+1,4,'0') max,		\n");
			strQuery.append("		to_char(SYSDATE,'YYYYMM') yyyymm										\n");
			strQuery.append("  FROM cmc0100																	\n");
			strQuery.append(" WHERE substr(cc_srid,2,6) = to_char(SYSDATE,'YYYYMM')							\n");
			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();
			
			if(rs.next()){
				SR_ID = "R"+rs.getString("yyyymm")+"-"+rs.getString("max");
			}
			
			rs.close();
			pstmt.close();
			
			strQuery.setLength(0);
			strQuery.append("INSERT INTO CMC0100												\n");
			strQuery.append("(cc_srid,		cc_devdept,		cc_reqtitle,	cc_reqdept,			\n");
			strQuery.append(" cc_requser,	cc_createuser,	cc_reqdate,		cc_reqcompdate,		\n");
			strQuery.append(" cc_status,	cc_cattype,		cc_createdate,	cc_moiraregdate)    \n");
			strQuery.append("VALUES (?, ?, ?, ?, ?, ?, ?, ?, '0', '99', sysdate, sysdate)		\n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(++pstmtcount, SR_ID); //cc_srid
			
			if(param.get("rdpt") == null) { //���ߺμ��� �ش��ϴ� Ű�� ������
				return "1";
			} else if(param.get("rdpt").trim().equals("")){ //���ߺμ��� �ش��ϴ� ���� ������
				return "10";
			} else {
				strQuery.setLength(0);
				strQuery.append("SELECT  cm_deptcd			\n");
				strQuery.append("FROM    CMM0100			\n");
				strQuery.append("WHERE   cm_deptname = ?	\n");
				
				pstmt2 = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString());
				
				pstmt2.setString(1, param.get("rdpt"));
				//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				
				rs2 = pstmt2.executeQuery();
				
				if(rs2.next()){
					cc_devdept = rs2.getString("cm_deptcd");
				} else { //��������� ��ϵ��� ���� ���ߺμ���
					return "11";
				}
				
				rs2.close();
				pstmt2.close();
				
				pstmt.setString(++pstmtcount, cc_devdept); //cc_devdept
			}
			
			if(param.get("subj") == null) { //SR���� �ش��ϴ� Ű�� ������
				return "2";
			} else if(param.get("subj").trim().equals("")) { //SR���� �ش��ϴ� ���� ������
				return "20";
			} else {
				pstmt.setString(++pstmtcount, param.get("subj")); //cc_reqtitle
			}
			
			if(param.get("sdpt") == null) { //�Ƿںμ��� �ش��ϴ� Ű�� ������
				return "3";
			} else if(param.get("sdpt").trim().equals("")) { //�Ƿںμ��� �ش��ϴ� ���� ������
				return "30";
			} else {
				strQuery.setLength(0);
				strQuery.append("SELECT  cm_deptcd			\n");
				strQuery.append("FROM    CMM0100			\n");
				strQuery.append("WHERE   cm_deptname = ?	\n");
				
				pstmt2 = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString());
				
				pstmt2.setString(1, param.get("sdpt"));
				//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				
				rs2 = pstmt2.executeQuery();
				
				if(rs2.next()){
					cc_reqdept = rs2.getString("cm_deptcd");
				} else { //��������� ��ϵǾ����� ���� �Ƿںμ���
					return "31";
				}
				
				rs2.close();
				pstmt2.close();
				
				pstmt.setString(++pstmtcount, cc_reqdept); //cc_reqdept
			}
			
			if(param.get("snm") == null) { //�Ƿ��ڿ� �ش��ϴ� Ű�� ������
				return "4";
			} else if(param.get("snm").trim().equals("")) { //�Ƿ��ڿ� �ش��ϴ� ���� ������
				return "40";
			} else {
				strQuery.setLength(0);
				
				strQuery.append("SELECT  cm_userid					\n");
				strQuery.append("FROM    CMM0040					\n");
				strQuery.append("WHERE   cm_username	=	?		\n");
				strQuery.append("AND	 cm_active		=	'1'		\n");
				strQuery.append("AND	 cm_project		=	?		\n");
				
				pstmt2 = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString());
				
				pstmt2.setString(1, param.get("snm"));
				pstmt2.setString(2, cc_reqdept);
				//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				
				rs2 = pstmt2.executeQuery();
				
				if(rs2.next()){
					User_ID = rs2.getString("cm_userid");
				} else { //��������� ��ϵ��� ���� �����(�Ƿ���)���
					return "41";
				}
				
				rs2.close();
				pstmt2.close();
				
				pstmt.setString(++pstmtcount, User_ID); //cc_createuser (�ӽ�)
				pstmt.setString(++pstmtcount, User_ID); //cc_requser
			}

			if(param.get("sdt") == null) { //��û�Ͽ� �ش��ϴ� Ű�� ���ٸ�
				return "5";
			} else if(param.get("sdt").trim().equals("")){ //��û�Ͽ� �ش��ϴ� ���� ���ٸ�
				return "50";
			} else {
				cc_reqdate = param.get("sdt").replaceAll("-", ""); //YYYYMMDD����
				if( cc_reqdate.trim().length() < 8){ //��û���� 8�ڸ� ���϶��
					return "51";
				} else if( cc_reqdate.trim().length() > 8) { //��û�Ͽ� 8�ڸ� �̻��̸�
					return "52";
				}
				pstmt.setString(++pstmtcount, cc_reqdate); //cc_reqdate
			}
			
			if(param.get("odt") == null) { //�Ϸ��û�Ͽ� �ش��ϴ� Ű�� ���ٸ�
				return "6";
			} else if(param.get("odt").trim().equals("")){ //�Ϸ��û�Ͽ� �ش��ϴ� ���� ���ٸ�
				return "60";
			}else {
				cc_reqcompdate = param.get("odt").replaceAll("-", ""); //YYYYMMDD����
				if( cc_reqcompdate.length() < 8){ //�Ϸ��û���� 8�ڸ� ���϶��
					return "61";
				} else if( cc_reqcompdate.length() > 8) { //�Ϸ��û�Ͽ� 8�ڸ� �̻��̸�
					return "62";
				}
				pstmt.setString(++pstmtcount, cc_reqcompdate); //cc_reqcompdate
			}
			
			pstmt.executeUpdate();
			pstmt.close();
			
			/* �˸��޼��� ���忡 ���(���ߺμ��� ���� ��� ����� ���) */
			strQuery.setLength(0);
			strQuery.append("INSERT INTO CMR9910 (cr_conusr, cr_senddate, cr_status, cr_sendusr,	\n");			
			strQuery.append("					  cr_sgnmsg, cr_acptno, cr_title, cr_linkurl,		\n");			
			strQuery.append("					  cr_notigbn)                  		                \n");
			strQuery.append("SELECT      cm_userid, sysdate, '0', ?, ?, '999999999999', ?,			\n");
			strQuery.append("			(SELECT cm_url || ? cm_url	FROM CMM0010),'CO'  			\n");
			strQuery.append("FROM        CMM0040													\n");
			strQuery.append("WHERE       cm_project = ?												\n");
			strQuery.append("AND         cm_active = '1'											\n");

			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			
			msgContent.setLength(0);
			
			msgContent.append("1. �Ƿ��� : "	+ "[" + param.get("sdpt") + "] " + param.get("snm") + "\r\n");
			msgContent.append("2. ���� : "	+ param.get("subj") 								+ "\r\n");
			msgContent.append("3. ���� : �����Ƿڼ��� �����Ǿ����ϴ�." 								+ "\r\n");
			msgContent.append("   ��������ý���(eCAMS)�� �����Ͽ� [SR���]ȭ�鿡��" 					+ "\r\n");
			msgContent.append("   Ȯ���Ͽ� �ֽñ� �ٶ��ϴ�." 												);
			
			pstmt.setString(1, User_ID); //cr_sendusr - �Ƿڴ����
			pstmt.setString(2, msgContent.toString()); //cr_sgnmsg - �˸��޽��� ����
			pstmt.setString(3, msgTitle); //cr_title - �˸��޼��� Ÿ��Ʋ
			pstmt.setString(4, msgURL); //cr_linkurl - ��ũ URL
			pstmt.setString(5, cc_devdept); // cm_project - ���ߺμ�
			
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			
			pstmt.executeUpdate();
			pstmt.close();
			rs.close();
			
			conn.close();
			rs = null;
			rs2 = null;
			pstmt = null;
			pstmt2 = null;
			conn = null;			
		
			return "TRUE";
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() SQLException END ##");
			return "99";
			//throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() Exception END ##");
			return "70";
			//throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null) 	try{rs.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null) 	try{rs2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmc0100.insertMoiraSRInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of insertMoiraSRInfo() method statement	
}
