	
	/*****************************************************************************************
		1. program ID	: test_Tree2DAO.java
		2. create date	: 2006.08. 08
		3. auth		    : teok.kang
		4. update date	: 
		5. auth		    : 
		6. description	: test_Tree2DAO
	*****************************************************************************************/
	
	package app.eCmr;
	
	
//	import java.io.BufferedReader;
//	import java.io.BufferedWriter;
//	import java.io.File;
//	import java.io.FileInputStream;
//	import java.io.FileOutputStream;
//	import java.io.FileReader;
//	import java.io.FileWriter;
//	import java.io.InputStreamReader;
//	import java.io.OutputStreamWriter;
	import java.io.StringReader;
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
	
	import app.common.*;
import app.eCmd.Cmd0100;
	
	/**
	 * @author bigeyes
	 * TODO To change the template for this generated type comment go to
	 * Window - Preferences - Java - Code Style - Code Templates
	 */
	
	 
	
	public class Cmr0300{
		
	    /**
	 * Logger Class Instance Creation
	 * logger
	 */
	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
	
	/**
	 * 게시판을 조회합니다.(구분값을 주어)
	 * @param  gbn
	 * @return ArrayList
	 * @throws SQLException
	 * @throws Exception
	 */
	
	
	public Object[] getDocList(String prjNo,String docSeq,String UserId,String ChildYn) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		Object[]		  rtObj		  = null;
		
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();
	
			
			strQuery.append("select distinct a.CR_DOCFILE,to_char(a.CR_LASTDT,'yyyymmdd') as lastdt,	   \n"); 
			strQuery.append("a.CR_LSTVER,a.CR_CCBYN, a.cr_docid,a.cr_prjno, d.cm_codename, a.cr_status,	   \n");
			strQuery.append("c.cr_docseq,e.cm_username, j.CD_DEVHOME as dirpath,a.cr_docsta				   \n"); 
			strQuery.append("from cmr0030 a, cmd0304 b, cmr0031 c,cmm0020 d,cmm0040 e, cmd0300 j 		   \n");
			strQuery.append("where c.cr_prjno= ? 														   \n");
			strQuery.append("And  b.cd_prjno=c.cr_prjno 												   \n");
			strQuery.append("and c.cr_docid=a.cr_docid 													   \n");  
			strQuery.append("AND a.cr_closedt is null and nvl(a.cr_docsta,'0')<>'1'  				       \n");    
			strQuery.append("And d.cm_macode='CMR0020' and d.cm_micode=a.cr_status 						   \n");
			strQuery.append("And a.cr_lstver>0 and a.cr_status='0' 										   \n");
			strQuery.append("and b.CD_PRJUSER= ? 														   \n");
			strQuery.append("AND j.CD_USERID = b.CD_PRJUSER 											   \n");
			strQuery.append("AND j.CD_SYSCD='99999' 													   \n");
			strQuery.append("And a.cr_editor=e.cm_userid 												   \n");
			if (ChildYn.toUpperCase().equals("Y")){
				strQuery.append("and c.cr_docseq in ( SELECT CD_DOCSEQ FROM (SELECT * FROM CMD0303 		   \n");
				strQuery.append("			                         		 WHERE CD_PRJNO = ?) 		   \n");
				strQuery.append("   				  START WITH CD_UPDOCSEQ = ? 						   \n");
				strQuery.append("					  CONNECT BY PRIOR CD_DOCSEQ = CD_UPDOCSEQ 			   \n");
				strQuery.append("					  UNION 											   \n");
				strQuery.append("                     SELECT ? FROM DUAL) 								   \n");
			}
			else{
				strQuery.append("and c.cr_docseq= ? ");
			}
			
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt = conn.prepareStatement(strQuery.toString());
			
			pstmt.setString(1, prjNo);
			pstmt.setString(2, UserId);
			if (ChildYn.toUpperCase().equals("Y")){
				pstmt.setString(3, prjNo);
				pstmt.setString(4, docSeq);
				pstmt.setString(5, docSeq);
			}
			else{
				pstmt.setString(3, docSeq);
			}
			
			
			
			////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			
			rs = pstmt.executeQuery();            
			
			rsval.clear();
			
			while (rs.next()){
				rst = new HashMap<String, String>();
				rst.put("cr_docfile", rs.getString("cr_docfile"));
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("lastdt", rs.getString("lastdt"));
				rst.put("cm_codename", rs.getString("cm_codename"));
				rst.put("cr_lstver", rs.getString("cr_lstver"));
				rst.put("cr_ccbyn", rs.getString("cr_ccbyn"));
				rst.put("cr_docid", rs.getString("cr_docid"));
				rst.put("cr_docseq", rs.getString("cr_docseq"));
				rst.put("cr_prjno", rs.getString("cr_prjno"));
				rst.put("dirpath", rs.getString("dirpath"));
				rst.put("cr_status", rs.getString("cr_status"));
				rst.put("selected_flag","0");
				rsval.add(rst);
				rst = null;
			}//end of while-loop statement
		
			rs.close();
			pstmt.close();
			conn.close();
			
			conn = null;
			pstmt = null;
			rs = null;
			rtObj =  rsval.toArray();
			
			rsval = null;
			
			return rtObj;
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## test_Tree2DAO.TreeList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## test_Tree2DAO.TreeList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## test_Tree2DAO.TreeList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## test_Tree2DAO.TreeList() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rtObj != null)	rtObj = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## test_Tree2DAO.TreeList() connection release exception ##");
				ex3.printStackTrace();
				}
			}
			rtObj = null;
		}
		
	}//end of TreeList() method statement		
	
	public Object[] getDocListCond(String prjNo,String gbnCD,String UserId,String keyStr) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		Object[]		  rtObj		  = null;
		
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();
	
			strQuery.append("select distinct a.CR_DOCFILE,to_char(a.CR_LASTDT,'yyyymmdd') as lastdt,	   \n"); 
			strQuery.append("a.CR_LSTVER,a.CR_CCBYN, a.cr_docid,a.cr_prjno, d.cm_codename, a.cr_status,	   \n");
			strQuery.append("c.cr_docseq,e.cm_username, j.CD_DEVHOME as dirpath          				   \n"); 
			strQuery.append("from cmr0030 a, cmd0304 b, cmr0031 c,cmm0020 d,cmm0040 e, cmd0300 j 		   \n");
			strQuery.append("where c.cr_prjno= ? 														   \n");
			strQuery.append("And  b.cd_prjno=c.cr_prjno 												   \n");
			strQuery.append("and c.cr_docid=a.cr_docid 													   \n");  
			strQuery.append("AND a.cr_closedt is null 												       \n");    
			strQuery.append("And d.cm_macode='CMR0020' and d.cm_micode=a.cr_status 						   \n");
			strQuery.append("And a.cr_lstver>0 and a.cr_status='0' 										   \n");
			strQuery.append("AND nvl(a.cr_docsta,'0')<>'1'                                                 \n");
			strQuery.append("and b.CD_PRJUSER= ? 														   \n");
			strQuery.append("AND j.CD_USERID = b.CD_PRJUSER 											   \n");
			strQuery.append("AND j.CD_SYSCD='99999' 													   \n");
			strQuery.append("And a.cr_editor=e.cm_userid 												   \n");
			if (gbnCD.equals("04")){
				strQuery.append("and a.cr_DEVSTEP= (SELECT CM_micode FROM CMM0020 WHERE					   \n");
				strQuery.append("					CM_MACODE='DEVSTEP' AND CM_CODENAME= ? )			   \n");
			}
			else if(gbnCD.equals("05")){
				strQuery.append("and a.CR_DOCFILE like ?												   \n");
			}
			
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, prjNo);
			pstmt.setString(2, UserId);
			if (gbnCD.equals("04")){
				pstmt.setString(3, keyStr.trim());
			}
			else if(gbnCD.equals("05")){
				pstmt.setString(3, "%"+keyStr+ "%");
			}
			////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			
			rs = pstmt.executeQuery();
			
			rsval.clear();
			
			while (rs.next()){
				rst = new HashMap<String, String>();
				rst.put("cr_docfile", rs.getString("cr_docfile"));
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("lastdt", rs.getString("lastdt"));
				rst.put("cm_codename", rs.getString("cm_codename"));
				rst.put("cr_lstver", rs.getString("cr_lstver"));
				rst.put("cr_ccbyn", rs.getString("cr_ccbyn"));
				rst.put("cr_docid", rs.getString("cr_docid"));
				rst.put("cr_docseq", rs.getString("cr_docseq"));
				rst.put("cr_prjno", rs.getString("cr_prjno"));
				rst.put("dirpath", rs.getString("dirpath"));
				rst.put("cr_status", rs.getString("cr_status"));
				rst.put("selected_flag","0");
				rsval.add(rst);
				rst = null;
			}//end of while-loop statement
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			pstmt = null;
			rs = null;
			rtObj =  rsval.toArray();
			
			rsval = null;
			
			return rtObj;
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## test_Tree2DAO.TreeList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## test_Tree2DAO.TreeList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## test_Tree2DAO.TreeList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## test_Tree2DAO.TreeList() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rtObj != null)	rtObj = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## test_Tree2DAO.TreeList() connection release exception ##");
						ex3.printStackTrace();
				}
			}
		}
	}//end of TreeList() method statement
	
	public String fileDownChk(String AcptNo) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		String			  rsval       = null;
		
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();
	
			strQuery.append("select CR_TEAMCD from cmr9900 \n"); 
			strQuery.append("where cr_acptno= ? \n");
			strQuery.append("and   cr_locat = '00' \n");
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, AcptNo);
			////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			
			rs = pstmt.executeQuery();            
			
			rsval = null;
			if (rs.next()){
				rsval = rs.getString("CR_TEAMCD");
			}//end of while-loop statement
				
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			pstmt = null;
			rs = null;
			return rsval;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0300.fileDownChk() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmr0300.fileDownChk() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0300.fileDownChk() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmr0300.fileDownChk() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.fileDownChk() connection release exception ##");
						ex3.printStackTrace();
					}
				}
			}
			
		}//end of TreeList() method statement		
		
	
	public String gyulCheck(String syscd,String reqcd,String ccbyn,String UserID) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		int				  rsval       = -1;
		UserInfo		  userInfo    = new UserInfo();
		HashMap<String,String>	rData = null;
		
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();
	
			Object[] uInfo = userInfo.getUserInfo(UserID);
			userInfo = null;
	    	rData = (HashMap<String, String>) uInfo[0];
	    	
			strQuery.append("select cm_gubun,cm_position from cmm0060 \n"); 
			strQuery.append("where cm_syscd= ? \n");
			strQuery.append("and cm_reqcd= ? \n");
			if (rData.get("cm_manid").toUpperCase().equals("Y")){
				strQuery.append("and cm_manid='1' \n");
			}
			else{
				strQuery.append("and cm_manid='2' \n");
			}
			rData = null;
			uInfo = null;
			
			if (ccbyn.toUpperCase().equals("Y")){
				strQuery.append("and (cm_rsrccd is null or (cm_rsrccd is not null and cm_rsrccd='Y')) \n");
			}else{
				strQuery.append("and cm_rsrccd is null \n");
			}
			strQuery.append("and cm_gubun<>'1' \n");
			
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, syscd);
			pstmt.setString(2, reqcd);
			////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			
			rs = pstmt.executeQuery();            
			
			rsval = -1;
			
			while (rs.next()){
				++rsval;
				if (rs.getString("cm_gubun").equals("4")) {
					if (rs.getString("cm_position").indexOf("16")>=0) {
						rsval = 99;
						break;
					}
				}
			}//end of while-loop statement
		
			rs.close();
			pstmt.close();
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			return Integer.toString(rsval);
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0300.gyulCheck() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmr0300.gyulCheck() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0300.gyulCheck() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmr0300.gyulCheck() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.gyulCheck() connection release exception ##");
						ex3.printStackTrace();
				}
			}
		}
	}//end of TreeList() method statement	
	
	
	public String acptNoChk(String acptNo) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		int				  rsval       = -1;
		
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();
			
			strQuery.append("select count(*) as cnt from cmr1000 \n"); 
			strQuery.append("where cr_acptno= ? 				 \n");
			strQuery.append("and cr_qrycd in ('31','32') 		 \n");
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, acptNo.replaceAll("-", ""));
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			
			rs = pstmt.executeQuery();            
			
			rsval = -1;
			
			if (rs.next()){
				rsval = rs.getInt("cnt");
			}//end of while-loop statement
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			pstmt = null;
			rs = null;
		
			return Integer.toString(rsval);
		
	} catch (SQLException sqlexception) {
		sqlexception.printStackTrace();
		ecamsLogger.error("## Cmr0300.acptNoChk() SQLException START ##");
		ecamsLogger.error("## Error DESC : ", sqlexception);	
		ecamsLogger.error("## Cmr0300.acptNoChk() SQLException END ##");			
		throw sqlexception;
	} catch (Exception exception) {
		exception.printStackTrace();
		ecamsLogger.error("## Cmr0300.acptNoChk() Exception START ##");				
		ecamsLogger.error("## Error DESC : ", exception);	
		ecamsLogger.error("## Cmr0300.acptNoChk() Exception END ##");				
		throw exception;
	}finally{
		if (strQuery != null) 	strQuery = null;
		if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
		if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
		if (conn != null){
			try{
				ConnectionResource.release(conn);
			}catch(Exception ex3){
				ecamsLogger.error("## Cmr0300.acptNoChk() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of TreeList() method statement	
	
	
	public String request_Check_Out(ArrayList<HashMap<String,String>> chkOutList,HashMap<String,String> etcData,ArrayList<HashMap<String,Object>> gyulData,HashMap<String,String> ccbynData) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		int				  pstmtcount  = 1;
		AutoSeq			  autoseq	  = new AutoSeq();
		UserInfo		  userInfo	  = new UserInfo();
		CodeInfo		  codeInfo	  = new CodeInfo();
		String			  AcptNo	  = null;
		int				  i;
		HashMap<String,String>	rData = null;
		StringReader sr = null;
	
		
		try {
			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);
			
	        for (i=0;i<chkOutList.size();i++){
	        	strQuery.setLength(0);
	                
	        	strQuery.append("select a.CR_STATUS, a.cr_docfile,b.cm_username,c.cm_codename \n");
				strQuery.append("from cmr0030 a,cmm0040 b,cmm0020 c \n");
				strQuery.append("where cr_docid = ? \n");
				strQuery.append("and a.cr_editor=b.cm_userid \n");
				strQuery.append("and c.cm_macode='CMR0020' and c.cm_micode=a.cr_status \n");
				
				pstmt = conn.prepareStatement(strQuery.toString());
				
				pstmt.setString(1, chkOutList.get(i).get("cr_docid"));
				
				rs = pstmt.executeQuery();
				
				if (rs.next()){
					if (!rs.getString("CR_STATUS").equals("0")){
						throw new Exception(rs.getString("cr_docfile")+" 파일은 " + rs.getString("cm_username") +"님이 " + rs.getString("cm_codename") +" 작업중입니다.");
					}
				}
				rs.close();
				pstmt.close();
			}
			
			
			AcptNo = autoseq.getSeqNo(conn,etcData.get("ReqCD"));
			autoseq = null;
			
			strQuery.setLength(0);
			
			strQuery.append("select count(*) as acptnocnt from cmr1000 \n");
			strQuery.append("where cr_acptno= ? \n");
			
			
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, AcptNo);
			
			rs = pstmt.executeQuery();
			
			while (rs.next()){
				i = rs.getInt("acptnocnt");
			}        	
			
			rs.close();
			pstmt.close();
			
			if (i>0){
				throw new Exception("["+ AcptNo +"]동일한 일련번호로 신청건이 있습니다.");
			}
			
			
			strQuery.setLength(0);
			strQuery.append("insert into cmr1000 ");
			strQuery.append("(CR_ACPTNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,CR_ACPTDATE,CR_STATUS,CR_TEAMCD,CR_QRYCD, ");
			strQuery.append("CR_PASSOK,CR_PASSCD,CR_EDITOR,CR_SAYU,CR_PRJNO,cr_prjname,cr_docno) values ( ");
			strQuery.append("?, ?, ?, ?, sysdate, '0', ?, ?, '0', ?, ? , ? , ?, ? ,'') ");
			
			
			
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(pstmtcount++, AcptNo);
			pstmt.setString(pstmtcount++, etcData.get("SysCD"));
			pstmt.setString(pstmtcount++, etcData.get("SysGB"));
			pstmt.setString(pstmtcount++, etcData.get("JobCD"));
			
			
			Object[] uInfo = userInfo.getUserInfo(etcData.get("UserID"));
			rData = (HashMap<String, String>) uInfo[0];
			pstmt.setString(pstmtcount++, rData.get("teamcd"));
			rData = null;
			uInfo = null;
			
			pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
			
			uInfo = codeInfo.getCodeInfo("REQUEST", "", "n");
			codeInfo = null;
			for (i=0;i<uInfo.length;i++){
				rData = (HashMap<String, String>) uInfo[i];
				if (rData.get("cm_micode").equals(etcData.get("ReqCD"))){
					pstmt.setString(pstmtcount++, rData.get("cm_codename"));
					rData = null;
					break;
				}
				rData = null;
			}
			uInfo = null;
			
			pstmt.setString(pstmtcount++, etcData.get("UserID"));
			pstmt.setString(pstmtcount++, etcData.get("Sayu"));
			pstmt.setString(pstmtcount++, etcData.get("PrjNo"));
			pstmt.setString(pstmtcount++, etcData.get("PrjName"));        			
			
			pstmt.executeUpdate();
			
			pstmt.close();
			
			for (i=0;i<chkOutList.size();i++){
				strQuery.setLength(0);
				strQuery.append("insert into cmr1100 ");
				strQuery.append("(CR_ACPTNO,CR_SERNO,CR_STATUS,CR_QRYCD,CR_DOCID,CR_PRJNO,CR_VERSION, ");
				strQuery.append("CR_BASENO,CR_PIDUP,CR_PUTCODE,CR_PCDIR,CR_EDITOR,CR_CCBYN,CR_UNITTIT,CR_DOCSEQ ) ");
				strQuery.append("values (?, ?, '0', ?, ?, ? ,? , ? ,'','', ?, ?, ?, ?, ? ) ");
				            	
				pstmtcount = 1;
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(pstmtcount++, AcptNo);
				pstmt.setInt(pstmtcount++, i+1);
				pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
				pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_docid"));         	
				pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_prjno"));
				pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_lstver"));
				pstmt.setString(pstmtcount++, AcptNo);
				pstmt.setString(pstmtcount++, chkOutList.get(i).get("dirpath"));
				pstmt.setString(pstmtcount++, etcData.get("UserID"));
				pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_ccbyn"));
				pstmt.setString(pstmtcount++, chkOutList.get(i).get("osayu"));
				pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_docseq"));
				
				pstmt.executeUpdate();
				pstmt.close();
			        
				strQuery.setLength(0);
				strQuery.append("update cmr0030 set ");
				if (etcData.get("ReqCD").equals("01") || etcData.get("ReqCD").equals("31")){
					strQuery.append("cr_status='4', ");
				}
				else if (etcData.get("ReqCD").equals("03") || etcData.get("ReqCD").equals("33")){
					strQuery.append("cr_status='C', ");
				}
				else if (etcData.get("ReqCD").equals("04") || etcData.get("ReqCD").equals("06")
						 || etcData.get("ReqCD").equals("34") || etcData.get("ReqCD").equals("36")){
					strQuery.append("cr_status='7', ");
				}
				else if (etcData.get("ReqCD").equals("11") || etcData.get("ReqCD").equals("41")){
					strQuery.append("cr_status='6', ");
				}
			
				strQuery.append("cr_editor= ? ");
				strQuery.append("where CR_DOCID= ? ");
				
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmtcount = 1;
				pstmt.setString(pstmtcount++, etcData.get("UserID"));
				pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_docid"));
			
				pstmt.executeUpdate();
				pstmt.close();
			}
				
			if (ccbynData.size() > 0){
				
				strQuery.setLength(0);
				strQuery.append("insert into cmr1002 ");
				strQuery.append("(CR_ACPTNO,CR_STATUS,CR_QRYCD,CR_NUMBER,CR_TITLE,CR_EDITOR,CR_PRCDATE,CR_MD,CR_STORY) ");
				strQuery.append("values ( ? , '0', ?, ?, ?, ?, sysdate, ?, ? ) ");
				
				pstmtcount = 1;
				pstmt = conn.prepareStatement(strQuery.toString());
				
				
				pstmt.setString(pstmtcount++, AcptNo);
				pstmt.setString(pstmtcount++, ccbynData.get("reqgbn"));
				if (ccbynData.get("reqno") == null){
					pstmt.setString(pstmtcount++, "");
				}
				else{
					if (ccbynData.get("reqno").equals("")){
						pstmt.setString(pstmtcount++, "");
					}
					else{
						pstmt.setString(pstmtcount++, ccbynData.get("reqno").replaceAll("-",""));
					}
				}
				pstmt.setString(pstmtcount++, ccbynData.get("title"));
				pstmt.setString(pstmtcount++, etcData.get("UserID"));
				pstmt.setString(pstmtcount++, ccbynData.get("md"));
				sr = new StringReader(ccbynData.get("content"));
				pstmt.setCharacterStream(pstmtcount++, sr, ccbynData.get("content").length());
				
			
				pstmt.executeUpdate();
				pstmt.close();
			}
			Cmr0200 cmr0200 = new Cmr0200();
			String retMsg = null;
        	if (gyulData.size() > 0) {
        		retMsg = cmr0200.request_Confirm(AcptNo,etcData.get("SysCD"),etcData.get("ReqCD"),etcData.get("UserID"),true,gyulData,conn);
        	} else {
        		retMsg = cmr0200.request_Confirm(AcptNo,etcData.get("SysCD"),etcData.get("ReqCD"),etcData.get("UserID"),false,gyulData,conn);
        	}
        	if (!retMsg.equals("OK")) {
        		AcptNo = "ERROR결재정보작성 중 오류가 발생하였습니다.";
        		conn.rollback();
        	} else {
        		conn.commit();
        	}
        	conn.close();
        	rs = null;
        	pstmt = null;
        	conn = null;
        	
			userInfo = null;
			
			return AcptNo;        	
		
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.request_Check_Out() connection release exception ##");
					ex3.printStackTrace();
				}				
			}
			ecamsLogger.error("## Cmr0300.request_Check_Out() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmr0300.request_Check_Out() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.request_Check_Out() connection release exception ##");
					ex3.printStackTrace();
				}				
			}			
			ecamsLogger.error("## Cmr0300.request_Check_Out() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmr0300.request_Check_Out() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.commit();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.request_Check_Out() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}		
	}	
	
	public String confSelect(String SysCd,String ReqCd,String RsrcCd,String UserId) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		String            retMsg      = "";
		try {
		    
			conn = connectionContext.getConnection();
			strQuery.append("select a.cm_gubun,a.cm_rsrccd                           \n");
			strQuery.append("  from cmm0060 a,cmm0040 b                              \n");
			strQuery.append(" where a.cm_syscd=? and a.cm_reqcd=?                    \n");
			strQuery.append("   and decode(a.cm_manid,'1','Y','N')=b.cm_manid        \n");
			strQuery.append("   and b.cm_userid=?                                    \n");
			
			pstmt = conn.prepareStatement(strQuery.toString());	
			//pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, SysCd);
			pstmt.setString(2, ReqCd);
			pstmt.setString(3, UserId);  
			////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());  
			rs = pstmt.executeQuery();
			while (rs.next()){
				retMsg = "N";
				if (!rs.getString("cm_gubun").equals("1") && !rs.getString("cm_gubun").equals("2")) {            		
					if (rs.getString("cm_rsrccd") != null) {
						String strRsrc[] = RsrcCd.split(",");
						for (int i = 0;strRsrc.length > i; i++) {
							if (rs.getString("cm_rsrccd").indexOf(strRsrc[i]) >= 0) {
								retMsg = "Y";
								break;
							}
						}            			
					} else {
						retMsg = "Y";
			    		break;
			    	}            		
			    }
			}
		    rs.close();
		    pstmt.close();
		    conn.close();
			conn = null;
			pstmt = null;
			rs = null;
			
			
		    return retMsg;
				
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0300.confSelect() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmr0300.confSelect() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0300.confSelect() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmr0300.confSelect() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.confSelect() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	
	public Object[] getDocFileList(String AcptNo) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		Object[]		  rtObj		  = null;
		
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();
			
			strQuery.append("select A.CR_SERNO,A.CR_DOCID,replace(A.CR_PCDIR,'\\','\\\\') as CR_PCDIR2,\n");
			strQuery.append("		A.CR_PCDIR,a.CR_VERSION,c.CR_DOCFILE,c.cr_methcd,c.cr_devstep \n");
			strQuery.append("  from cmr1100 A,CMR0030 C 	\n");
			strQuery.append(" Where A.cr_acptno= ? 		\n");
			strQuery.append("   AND A.cr_qrycd <> '05'	\n");
			strQuery.append("   AND nvl(A.cr_errcd,'ERR1')<>'0000' 	\n");
			strQuery.append("   AND A.cr_prcdate is null 			\n");
			strQuery.append("   AND A.CR_DOCID=C.CR_DOCID 			\n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
	//		pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1, AcptNo);
			
	//	    ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			
			rs = pstmt.executeQuery();
			            
			rsval.clear();
			
			while (rs.next()){
				rst = new HashMap<String, String>();
				rst.put("CR_SERNO", rs.getString("CR_SERNO"));
				rst.put("CR_DOCID", rs.getString("CR_DOCID"));
				rst.put("CR_PCDIR", rs.getString("CR_PCDIR"));
				rst.put("CR_PCDIR2", rs.getString("CR_PCDIR2"));
				rst.put("CR_VERSION", rs.getString("CR_VERSION"));
				rst.put("CR_DOCFILE", rs.getString("CR_DOCFILE"));
				rst.put("cr_methcd", rs.getString("cr_methcd"));
				rst.put("cr_devstep", rs.getString("cr_devstep"));
				rst.put("sendflag","0");
				rst.put("errflag","0");
				rsval.add(rst);
				rst = null;
			}//end of while-loop statement
		
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			pstmt = null;
			rs = null;
			rtObj =  rsval.toArray();
			
			rsval = null;
			
			return rtObj;
	} catch (SQLException sqlexception) {
		sqlexception.printStackTrace();
		ecamsLogger.error("## test_Tree2DAO.TreeList() SQLException START ##");
		ecamsLogger.error("## Error DESC : ", sqlexception);	
		ecamsLogger.error("## test_Tree2DAO.TreeList() SQLException END ##");			
		throw sqlexception;
	} catch (Exception exception) {
		exception.printStackTrace();
		ecamsLogger.error("## test_Tree2DAO.TreeList() Exception START ##");				
		ecamsLogger.error("## Error DESC : ", exception);	
		ecamsLogger.error("## test_Tree2DAO.TreeList() Exception END ##");				
		throw exception;
	}finally{
		if (strQuery != null) 	strQuery = null;
		if (rtObj != null)	rtObj = null;
		if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
		if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
		if (conn != null){
			try{
				ConnectionResource.release(conn);
			}catch(Exception ex3){
				ecamsLogger.error("## test_Tree2DAO.TreeList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
		
		
	}//end of TreeList() method statement	
	
	public String getTmpDirConf(String pCode) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		String			  rtString = null;
		
		try {
			conn = connectionContext.getConnection();
		
			strQuery.append("SELECT CM_DOWNIP,CM_DOWNPORT \n");
			strQuery.append("FROM cmm0012 \n");
			strQuery.append("WHERE cm_stno = 'ECAMS' \n");
			strQuery.append("AND cm_pathcd = ? \n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, pCode);
			
			rs = pstmt.executeQuery();
			
			while (rs.next()){
				rtString = rs.getString("CM_DOWNIP")+","+rs.getString("CM_DOWNPORT");
			}//end of while-loop statement
		
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			pstmt = null;
			rs = null;
			return rtString;
		
	} catch (SQLException sqlexception) {
		sqlexception.printStackTrace();
		ecamsLogger.error("## SystemPath.getSysPath() SQLException START ##");
		ecamsLogger.error("## Error DESC : ", sqlexception);	
		ecamsLogger.error("## SystemPath.getSysPath() SQLException END ##");			
		throw sqlexception;
	} catch (Exception exception) {
		exception.printStackTrace();
		ecamsLogger.error("## SystemPath.getSysPath() Exception START ##");				
		ecamsLogger.error("## Error DESC : ", exception);	
		ecamsLogger.error("## SystemPath.getSysPath() Exception END ##");				
		throw exception;
	}finally{
		if (strQuery != null) 	strQuery = null;
		if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
		if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
		if (conn != null){
			try{
				ConnectionResource.release(conn);
			}catch(Exception ex3){
				ecamsLogger.error("## SystemPath.getSysPath() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
		
	}//end of SelectUserInfo() method statement
	

	public Boolean setTranResult(String acptNo,String serNo,String ret) throws SQLException, Exception {
		Connection        conn       		 = null;
		PreparedStatement pstmt     	     = null;
		ResultSet         rs         		 = null;
		StringBuffer      strQuery  	     = new StringBuffer();
		ConnectionContext connectionContext  = new ConnectionResource();
		String 			  errCode    		 = "";
		int				  nerrCode 	 		 = 0;
		
		try {
			conn = connectionContext.getConnection();
			
			conn.setAutoCommit(false);
	
			nerrCode = Integer.parseInt(ret);
			
			if (nerrCode == -8){
				errCode = "SVER";
			}
			else if (nerrCode == -7){
				errCode = "EROR";
			}
			else{
				errCode = String.format("%04d", nerrCode);
			}
	
			strQuery.setLength(0);
			strQuery.append("update cmr1100 set cr_errcd = ? \n");
			strQuery.append("where cr_acptno= ? \n");
			strQuery.append("and cr_serno= ? \n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			
			pstmt.setString(1, errCode);
			pstmt.setString(2, acptNo);
			pstmt.setInt(3, Integer.parseInt(serNo));
			
		    pstmt.executeUpdate();
		    pstmt.close();
		    conn.commit();
		    conn.close();
		    
			return true;
		
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.setTranResult() connection release exception ##");
				ex3.printStackTrace();
			}				
		}			
			ecamsLogger.error("## Cmr0300.setTranResult() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## Cmr0300.setTranResult() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.setTranResult() connection release exception ##");
				ex3.printStackTrace();
			}				
		}			
			ecamsLogger.error("## Cmr0300.setTranResult() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## Cmr0300.setTranResult() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.commit();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.setTranResult() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of SelectUserInfo() method statement		
	
	public boolean callCmr9900_Str(String acptNo) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
	
		int				  errcnt = 0;
		String			  szJobCD = "";
	
		try {
			conn = connectionContext.getConnection();
		
			strQuery.setLength(0);
			strQuery.append("select count(*) errcnt from cmr1100 \n");
			strQuery.append("where cr_acptno= ? \n");
			strQuery.append("  and cr_errcd != '0000' \n");
			strQuery.append("  and cr_status <> '3' \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, acptNo);
			rs = pstmt.executeQuery();
			errcnt = -1;
			if (rs.next()){
				errcnt = rs.getInt("errcnt");
			}
			
			if (errcnt != 0){
				throw new Exception("정상적으로 송수신하지  못한 파일이 있으니 목록에서 확인, 원인 조치 후 다시처리 하십시오.");
			}
			
			rs.close();
			pstmt.close();
			
			strQuery.setLength(0);
			strQuery.append("select cr_team from cmr9900 \n");
			strQuery.append("where cr_acptno= ? \n");
			strQuery.append("  and cr_locat = '00' \n");
			strQuery.append("  and cr_status = '0' \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, acptNo);
			rs = pstmt.executeQuery();
			szJobCD = "";
			if (rs.next()){
				szJobCD = rs.getString("cr_team");
			}
			
			if (szJobCD == ""){
				throw new Exception("결재정보 오류입니다.");
			}
			rs.close();
			pstmt.close();
			
			strQuery.setLength(0);
			strQuery.append("Begin CMR9900_STR ( ");
			strQuery.append("?, ?, 'eCAMS자동처리', '9', '', '1' ); End;");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, acptNo);
			pstmt.setString(2, szJobCD);
			pstmt.executeUpdate();
			pstmt.close();
			
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			
			return true;
	
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.setTranResult() connection release exception ##");
				ex3.printStackTrace();
			}				
		}			
		ecamsLogger.error("## Cmr0300.setTranResult() SQLException START ##");
		ecamsLogger.error("## Error DESC : ", sqlexception);	
		ecamsLogger.error("## Cmr0300.setTranResult() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.setTranResult() connection release exception ##");
				ex3.printStackTrace();
			}				
		}			
		ecamsLogger.error("## Cmr0300.setTranResult() Exception START ##");				
		ecamsLogger.error("## Error DESC : ", exception);	
		ecamsLogger.error("## Cmr0300.setTranResult() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.commit();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.setTranResult() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}		
	}//fileStr = fileStream.toString("EUC-KR");
	public Object[] getCloseList(HashMap<String,String> etcData) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		int               cnt         = 0;
	
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
	
		ConnectionContext connectionContext = new ConnectionResource();
	
		boolean           errSw     = false;
		String            strRsrcCd = "";
		String            strRsrc[] = null;
		int               i = 0;
		boolean           srSw = false;
		try {
	
			conn = connectionContext.getConnection();
			if (etcData.get("srid") != null && !"".equals(etcData.get("srid"))) srSw = true;			
            if (etcData.get("RsrcCd") == null || "".equals(etcData.get("RsrcCd")) || "0000".equals(etcData.get("RsrcCd"))) etcData.put("RsrcCd", "00");
            //ecamsLogger.error("++++++++++RsrcCd+++++++++"+RsrcCd);
			
            strQuery.setLength(0);
			strQuery.append("select a.cm_rsrccd from cmm0036 a                  \n");
			strQuery.append(" where a.cm_syscd=? and a.cm_closedt is null       \n");
			strQuery.append("   and substr(a.cm_info, 2, 1)='1'                 \n");
			strQuery.append("   and substr(a.cm_info, 26, 1)='0'                \n");
			strQuery.append("   and not exists (select 1 from cmm0037           \n");
			strQuery.append("                    where cm_syscd=?               \n");
			strQuery.append("                      and cm_rsrccd<>cm_samersrc   \n");
			strQuery.append("                      and cm_samersrc=a.cm_rsrccd) \n");

			pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt =  new LoggableStatement(conn, strQuery.toString());
            pstmt.setString(1, etcData.get("SysCd"));
            pstmt.setString(2, etcData.get("SysCd"));
            //ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            rs = pstmt.executeQuery();
            while (rs.next()) {
            	if ("".equals(strRsrcCd)){
            		strRsrcCd = rs.getString("cm_rsrccd") + ",";
            	} else{
            		strRsrcCd = strRsrcCd + rs.getString("cm_rsrccd") + ",";
            	}
            }
			rs.close();
			pstmt.close();

			
			if ("".equals(strRsrcCd)){
				rs = null;
				pstmt = null;
	        	if (conn != null){
	        		conn.close();
	        		conn = null;
	        	}
				throw new Exception("형상관리 대상 프로그램이 없습니다. 관리자에게 연락하여 주시기 바랍니다.");
			}
	
			if(strRsrcCd.substring(strRsrcCd.length()-1).indexOf(",")>-1){
				strRsrcCd = strRsrcCd.substring(0,strRsrcCd.length()-1);
			}
			strRsrc = strRsrcCd.split(",");
			
	        cnt = 0;
			strQuery.setLength(0);
			strQuery.append("select /*+ ALL ROWS */                                             \n");
	    	strQuery.append("       a.cr_rsrcname,a.cr_lstver,a.cr_syscd,a.cr_dsncd,            \n");
		    strQuery.append("       a.cr_itemid,a.cr_rsrccd,a.cr_story,a.cr_jobcd,              \n");
	    	strQuery.append("       to_char(nvl(a.cr_lstdat,a.cr_lastdate),'yyyy/mm/dd hh24:mi') lastdate, \n");
		    strQuery.append("       a.cr_status,i.cm_info, a.cr_lstusr,b.cm_systype,a.cr_acptno,\n");
		    strQuery.append("       nvl(a.cr_viewver,'0.0.0.0') cr_viewver,a.cr_ckoutacpt,      \n");
		    strQuery.append("       lpad(i.cm_stepsta,4,'0') prcreq,nvl(i.cm_vercnt,50) vercnt, \n");
		    strQuery.append("       b.cm_sysgb,a.cr_acptno,a.cr_devacpt,a.cr_testacpt,          \n");
		    strQuery.append("       (select cm_dirpath from cmm0070                             \n");
		    strQuery.append("         where cm_syscd=a.cr_syscd                                 \n");
		    strQuery.append("           and cm_dsncd=a.cr_dsncd) cm_dirpath,                    \n");
		    strQuery.append("       (select cm_codename from cmm0020                            \n");
		    strQuery.append("         where cm_macode='CMR0020'                                 \n");
		    strQuery.append("           and cm_micode=a.cr_status) cm_codename,                 \n");
		    strQuery.append("       (select cm_codename from cmm0020                            \n");
		    strQuery.append("         where cm_macode='JAWON'                                   \n");
		    strQuery.append("           and cm_micode=a.cr_rsrccd) jawon,                       \n");
		    strQuery.append("       (select cm_username from cmm0040                            \n");
		    strQuery.append("         where cm_userid=nvl(a.cr_lstusr,a.cr_editor)) cm_username,\n");
		    strQuery.append("       (select cm_jobname from cmm0102                             \n");
		    strQuery.append("         where cm_jobcd=a.cr_jobcd) cm_jobname,                    \n");
		    strQuery.append("       (select cr_aftviewver from cmr0021                          \n");
		    strQuery.append("         where cr_itemid=a.cr_itemid                      			\n");
		    strQuery.append("           and cr_acptno=decode(?,'05',decode(b.cm_systype,'A',a.cr_acptno,'F',a.cr_acptno,'G',a.cr_acptno,'H',a.cr_acptno,a.cr_devacpt),'09',a.cr_testacpt,a.cr_realacpt)) befver,\n");
		    strQuery.append("       (select cr_version from cmr0021                             \n");
		    strQuery.append("         where cr_itemid=a.cr_itemid                      			\n");
		    strQuery.append("           and cr_acptno=decode(?,'05',decode(b.cm_systype,'A',a.cr_acptno,'F',a.cr_acptno,'G',a.cr_acptno,'H',a.cr_acptno,a.cr_devacpt),'09',a.cr_testacpt,a.cr_realacpt)) version,\n");
		    strQuery.append("       PGMSTACHK(?,'BEF',b.cm_systype,a.cr_status,a.cr_lstver,a.cr_viewver) pgmsta \n");
			strQuery.append("  from cmr0020 a,cmm0036 i,cmm0030 b								\n");
			strQuery.append(" where a.cr_syscd=?                                                \n");
			strQuery.append("   and a.cr_syscd=b.cm_syscd                                       \n");
			strQuery.append("   and a.cr_lstver>0                                               \n");
			if ("05".equals(etcData.get("SinCd"))) {
				strQuery.append("   and exists (select 1 from cmm0044                           \n");
				strQuery.append("                where cm_userid=?                              \n");
				strQuery.append("                  and cm_syscd=a.cr_syscd                      \n");
				strQuery.append("                  and cm_jobcd=a.cr_jobcd                      \n");
				strQuery.append("                  and cm_closedt is null)                      \n");
				strQuery.append("  and a.cr_status='0'                                          \n");
			} else {
				if ( srSw ) {//sr있을경우
					strQuery.append("   and a.cr_isrid=?                                        \n");
				}
				strQuery.append("   and a.cr_lstusr=?                                           \n");
			}
			if ( !etcData.get("RsrcCd").equals("00") ) strQuery.append("and a.cr_rsrccd=?       \n");
			if ( etcData.get("RsrcName") != null && !"".equals(etcData.get("RsrcName")) ) {
				strQuery.append("and ( upper(a.cr_rsrcname) like upper(?) or upper(a.cr_story) like upper(?) )\n");
			}
			strQuery.append("   and a.cr_syscd=i.cm_syscd and a.cr_rsrccd=i.cm_rsrccd           \n");	
	
			if ( "00".equals(etcData.get("RsrcCd"))) {
				strQuery.append("and a.cr_rsrccd in (");
				for (i=0;strRsrc.length>i;i++) {
					if (i==0) strQuery.append("?");
					else strQuery.append(",?");
				}
				strQuery.append(") \n");
			}
			//strQuery.append("order by cr_rsrcname                                               \n");
	
			//pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(++cnt, etcData.get("SinCd"));
			pstmt.setString(++cnt, etcData.get("SinCd"));
			pstmt.setString(++cnt, etcData.get("SinCd"));
			pstmt.setString(++cnt, etcData.get("SysCd"));
			if ("05".equals(etcData.get("SinCd"))) pstmt.setString(++cnt, etcData.get("UserId"));
			else {
				if (srSw) pstmt.setString(++cnt, etcData.get("srid"));
				pstmt.setString(++cnt, etcData.get("UserId"));				
			}
			if (!"00".equals(etcData.get("RsrcCd"))) pstmt.setString(++cnt, etcData.get("RsrcCd"));
			if (etcData.get("RsrcName") != null && !"".equals(etcData.get("RsrcName"))) {    	   
				pstmt.setString(++cnt, "%" + etcData.get("RsrcName") + "%"); 	   
				pstmt.setString(++cnt, "%" + etcData.get("RsrcName") + "%");
			}
			if ( "00".equals(etcData.get("RsrcCd"))) {
				for (i=0 ; i<strRsrc.length ; i++) {
	        		pstmt.setString(++cnt, strRsrc[i]);
	        	}
			}
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	        rs = pstmt.executeQuery();
	
			while (rs.next()){
				rst = new HashMap<String, String>();
				rst.put("cr_rsrcname", rs.getString("cr_rsrcname"));
				rst.put("jawon", rs.getString("jawon"));
				if (rs.getString("cr_story") != null) rst.put("cr_story", rs.getString("cr_story"));
				else  rst.put("cr_story", "");
				rst.put("cr_lstver", rs.getString("cr_lstver"));
								
				rst.put("cr_editor", rs.getString("cr_lstusr"));
				rst.put("codename", rs.getString("cm_codename"));
				rst.put("cr_syscd", rs.getString("cr_syscd"));
				rst.put("cr_dsncd", rs.getString("cr_dsncd"));
				rst.put("cr_itemid", rs.getString("cr_itemid"));
				rst.put("baseitem", rs.getString("cr_itemid"));
				rst.put("cr_jobcd", rs.getString("cr_jobcd"));
				rst.put("cr_rsrccd", rs.getString("cr_rsrccd"));
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("jobname", rs.getString("cm_jobname"));
				rst.put("cr_lastdate", rs.getString("lastdate"));
				rst.put("cm_info", rs.getString("cm_info"));
				rst.put("cr_status", rs.getString("cr_status"));
				rst.put("prcseq", rs.getString("prcreq"));
				rst.put("editRow", rs.getString("prcreq"));
				rst.put("sysgb", rs.getString("cm_sysgb"));
				rst.put("sortgbn", "0");
				
				rst.put("cr_viewver", rs.getString("cr_viewver"));
				
				if (rs.getString("version") != null) {
					rst.put("cr_befver", rs.getString("version"));
					rst.put("cr_befviewver", rs.getString("befver"));
				} else {
					rst.put("cr_befver", "0");
					rst.put("cr_befviewver", rs.getString("cr_viewver"));
				}
				
				rst.put("reqcd", "05");
				rst.put("cm_dirpath", rs.getString("cm_dirpath"));
				rst.put("view_dirpath", rs.getString("cm_dirpath"));
				rst.put("cm_systype", rs.getString("cm_systype"));
				
				
				errSw = false;
				if (!rs.getString("pgmsta").equals("OK")) {
					errSw = true;
				} else {
					if ("09".equals(etcData.get("SinCd")) || "10".equals(etcData.get("SinCd"))) {
						rst.put("cr_acptno", rs.getString("cr_acptno"));
					} 
					rst.put("cr_baseno", "");
				}
				
				if ( errSw ) {
					rst.put("selected", "0");
					rst.put("selected_flag", "1");
					rst.put("enabled", "0");
				} else {
					rst.put("selected","1");
					rst.put("selected_flag", "0");
					rst.put("enabled","1");	
				}
				rsval.add(rst);
				rst = null;
			}//end of while-loop statement
			rs.close();
			pstmt.close();
	        conn.close();
	        rs = null;
	        pstmt = null;
	        rs2 = null;
	        pstmt2 = null;
	        conn = null;
			
//	        ecamsLogger.error("############ getDeployList  E N D ########: "+rsval.toString());
	
			return rsval.toArray();
	
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0300.getCloseList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0300.getCloseList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0300.getCloseList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0300.getCloseList() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rsval != null)  rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)    try{rs2.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt2 != null) try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.getCloseList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getCloseList() method statement
	public Object[] getDownCloseList(ArrayList<HashMap<String,String>> fileList,HashMap<String,String> etcData) throws SQLException, Exception {
		StringBuffer      strQuery    = new StringBuffer();
		Object[]		  rtObj		  = null;
		ArrayList<HashMap<String, String>>		  rtList	  = new ArrayList<HashMap<String, String>>();
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2      = null;
		ConnectionContext connectionContext = new ConnectionResource();
		ResultSet         rs          = null;
		ResultSet         rs2         = null;
		HashMap<String, String>			  rst		  = null;
		HashMap<String, String>			  tmpObj      = null;
		int               reqCnt      = 0;
		int               addCnt      = 0;
		int               svCnt       = 0;
		boolean           ErrSw      = false;
		String            strErr      = "";
		String            strWork1    = null;
		String            strWork3    = null;
		String            strRsrcCd   = null;
		String            strRsrcName = null;

		int               i = 0;                                                                                               
		int               j = 0;
		int               parmCnt = 0;

		try {
			conn = connectionContext.getConnection();
			String strDirPath = "";
			String strHomeDirPath = "";
			String strSameDirPath = "";
			String strItemId = "";
			String strInfo = "";
			rtList.clear();
			for (i=0;fileList.size()>i;i++) {
				rst = new HashMap<String,String>();
				rst.put("cm_dirpath", fileList.get(i).get("cm_dirpath"));
				rst.put("view_dirpath", fileList.get(i).get("view_dirpath"));
				rst.put("cr_rsrcname",fileList.get(i).get("cr_rsrcname"));
				rst.put("cr_story",fileList.get(i).get("cr_story"));
				rst.put("cm_username", fileList.get(i).get("cm_username"));
				rst.put("jobname", fileList.get(i).get("jobname"));
				rst.put("jawon", fileList.get(i).get("jawon"));
				rst.put("cr_editor", fileList.get(i).get("cr_editor"));
				rst.put("codename", fileList.get(i).get("codename"));
				rst.put("cr_lastdate", fileList.get(i).get("cr_lastdate"));
          
				rst.put("prcseq", fileList.get(i).get("prcseq"));
				rst.put("cr_lstver",fileList.get(i).get("cr_lstver"));
				rst.put("cr_befver",fileList.get(i).get("cr_befver"));
				rst.put("cr_aftver",fileList.get(i).get("cr_aftver"));
				rst.put("cr_itemid",fileList.get(i).get("cr_itemid"));
				rst.put("sysgb", fileList.get(i).get("sysgb"));
				rst.put("cm_systype", fileList.get(i).get("cm_systype"));
				rst.put("cr_syscd", fileList.get(i).get("cr_syscd"));
				rst.put("cr_rsrccd",fileList.get(i).get("cr_rsrccd"));
				rst.put("cr_dsncd",fileList.get(i).get("cr_dsncd"));
				rst.put("cr_jobcd",fileList.get(i).get("cr_jobcd"));
				rst.put("baseitem",fileList.get(i).get("baseitem"));
				rst.put("cm_info",fileList.get(i).get("cm_info"));
				rst.put("cr_status",fileList.get(i).get("cr_status"));
				rst.put("cr_acptno",fileList.get(i).get("cr_acptno"));
				rst.put("prcseq",fileList.get(i).get("prcseq"));
				rst.put("editRow",fileList.get(i).get("editRow"));
				rst.put("sortgbn",fileList.get(i).get("sortgbn"));
				if (fileList.get(i).get("cr_sayu") != null && !"".equals(fileList.get(i).get("cr_sayu"))){
					rst.put("cr_sayu",fileList.get(i).get("cr_sayu"));
				}
				else{
					rst.put("cr_sayu",etcData.get("sayu"));
				}
				rst.put("reqcd",fileList.get(i).get("reqcd"));
				rst.put("cr_baseno",fileList.get(i).get("cr_baseno"));
				rst.put("cr_befviewver",fileList.get(i).get("cr_befviewver"));
				rst.put("enabled",fileList.get(i).get("enabled"));
				rst.put("selected",fileList.get(i).get("selected"));
				rst.put("selected_flag",fileList.get(i).get("selected_flag"));
				reqCnt = addCnt + 1;
				rst.put("seq", Integer.toString(reqCnt));
				rtList.add(addCnt++, rst);
				rst = null;
				svCnt = addCnt - 1;
				strRsrcName = fileList.get(i).get("cr_rsrcname");
				
				if (!ErrSw && "1".equals(fileList.get(i).get("cm_info").substring(3,4))) {
					strQuery.setLength(0);
					strQuery.append("select b.cm_samename,b.cm_samersrc,b.cm_basedir,         \n");
					strQuery.append("       b.cm_samedir,b.cm_basename,b.cm_cmdyn,a.cm_info   \n");
					strQuery.append("  from cmm0036 a,cmm0037 b                               \n");
					strQuery.append(" where b.cm_syscd=? and b.cm_rsrccd=?                    \n");
					strQuery.append("   and b.cm_factcd='04'                                  \n");
					strQuery.append("   and b.cm_syscd=a.cm_syscd                             \n");
					strQuery.append("   and b.cm_samersrc=a.cm_rsrccd                         \n");
					strQuery.append("   and substr(a.cm_info,16,1)='0'                        \n");  //폐기대상
					pstmt = conn.prepareStatement(strQuery.toString());
					pstmt =  new LoggableStatement(conn, strQuery.toString());
					pstmt.setString(1, fileList.get(i).get("cr_syscd"));
			        pstmt.setString(2, fileList.get(i).get("cr_rsrccd"));
		            ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			        rs = pstmt.executeQuery();

			        while (rs.next()) {
			            ErrSw = false;
			        	if (fileList.get(i).get("cr_rsrcname").indexOf(".") > -1) {
			        		strWork1 = fileList.get(i).get("cr_rsrcname").substring(0,fileList.get(i).get("cr_rsrcname").indexOf("."));
			        	} else {
			        		strWork1 = fileList.get(i).get("cr_rsrcname");
			        	}
			        	if (rs.getString("cm_samename").indexOf("?#")>=0) {
			        		tmpObj = new HashMap<String,String>();
			        		tmpObj.put("rsrcname",fileList.get(i).get("cr_rsrcname"));
			        		tmpObj.put("dirpath",fileList.get(i).get("cm_dirpath"));
			        		tmpObj.put("samename",rs.getString("cm_samename"));
			        		Cmr0200 cmr0200 = new Cmr0200();
			        		strWork3 = cmr0200.nameChange(tmpObj,conn);
			        		cmr0200 = null;
			        		if (strWork3.equals("ERROR")) {
			        			for (j=rtList.size()-1;j>=svCnt;j--) {
									rtList.remove(j);
								}
				            	strErr = "["+strRsrcName+"]에 대한 동시적용모듈정보가 정확하지 않습니다.";
								rst = new HashMap<String,String>();
								rst.put("cr_itemid","ERROR");
								rst.put("cm_dirpath",strErr);
								rst.put("cr_rsrcname",fileList.get(i).get("cr_rsrcname"));
								rtList.add(svCnt, rst);
								rst = null;
								ErrSw = true;
			        		}
			        	} else if (rs.getString("cm_samename").indexOf("*")<0) {
			        		strWork3 = rs.getString("cm_samename");
			        	} else if (rs.getString("cm_samename").equals("*.*")) {
			        		strWork3 = fileList.get(i).get("cr_rsrcname");
			        	} else {
			        		strWork3 = rs.getString("cm_samename").replace("*", strWork1);
			        	}
			        	
			        	
			        	strHomeDirPath = rs.getString("cm_basedir");
			        	strSameDirPath = rs.getString("cm_samedir");
			        	
						strDirPath = fileList.get(i).get("cm_dirpath");
						strDirPath = strDirPath.replaceAll("//", "/");		
//						rst.put("pcdir", strDirPath);
						
			        	if (strHomeDirPath != null) {
			        		if (!strHomeDirPath.equals("cm_samedir")){
			        			if (!strHomeDirPath.equals("*")) {
			        				if (strDirPath.indexOf(strHomeDirPath)<0) {
			        					continue;
			        				}
			        			}
			        			if (strHomeDirPath.equals("*") && strSameDirPath.indexOf("?#")<0) strDirPath = strSameDirPath;
			        			else if (strSameDirPath.indexOf("?#")>=0) {
					        		tmpObj = new HashMap<String,String>();
					        		tmpObj.put("rsrcname",fileList.get(i).get("cr_rsrcname"));
					        		tmpObj.put("dirpath",fileList.get(i).get("cm_dirpath"));
					        		tmpObj.put("samename",strSameDirPath);

					        		Cmr0200 cmr0200 = new Cmr0200();
					        		strWork3 = cmr0200.nameChange(tmpObj,conn);
					        		cmr0200 = null;
					        		if (strWork3.equals("ERROR")) {
					        			for (j=rtList.size()-1;j>=svCnt;j--) {
											rtList.remove(j);
										}
						            	strErr = "["+strRsrcName+"]에 대한 동시적용모듈정보가 정확하지 않습니다.";
										rst = new HashMap<String,String>();
										rst.put("cr_itemid","ERROR");
										rst.put("cm_dirpath",strErr);
										rst.put("cr_rsrcname",fileList.get(i).get("cr_rsrcname"));
										rtList.add(svCnt, rst);
										rst = null;
										ErrSw = true;
					        		}
			        			} else {
			        				strDirPath = strDirPath.replace(strHomeDirPath, strSameDirPath);
			        			}
			        		} else {
			        			if (rs.getString("cm_basename").equals("*") && rs.getString("cm_samename").equals("*.*")) {
			        				continue;
			        			}
			        					
			        		}
			        	}
			        	//ecamsLogger.error("ErrSw:"+ErrSw+", *** samedir, samename ++++"+strWork3 + ", "+ strDirPath);
			        	if ( !ErrSw ) {
				        	strRsrcCd = rs.getString("cm_samersrc");
				        	strInfo = rs.getString("cm_info");
				        	strItemId = "";
				        	parmCnt = 0;
				        	strQuery.setLength(0);
							strQuery.append("select a.cr_itemid                     \n");
						   	strQuery.append("  from cmm0070 b,cmr0020 a             \n");
						   	strQuery.append(" where a.cr_syscd=? and a.cr_rsrccd=?  \n");
						   	strQuery.append("   and upper(a.cr_rsrcname)= upper(?)  \n");
						   	if (strInfo.substring(25,26).equals("0") || !strDirPath.equals("*")) {
						   		strQuery.append("   and upper(b.cm_dirpath)=upper(?)\n");
						   	}
						   	strQuery.append("   and a.cr_syscd=b.cm_syscd           \n");
						   	strQuery.append("   and a.cr_dsncd=b.cm_dsncd           \n");
						    pstmt2 = conn.prepareStatement(strQuery.toString());
							//pstmt2 = new LoggableStatement(conn, strQuery.toString());
				            pstmt2.setString(++parmCnt, fileList.get(i).get("cr_syscd"));
				            pstmt2.setString(++parmCnt, strRsrcCd);
						   	pstmt2.setString(++parmCnt,strWork3);
						   	if (strInfo.substring(25,26).equals("0") || !strDirPath.equals("*")) {
						   		pstmt2.setString(++parmCnt,strDirPath);
						   	}
				            //ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
				            rs2 = pstmt2.executeQuery();
				            if (rs2.next()) {
				            	strItemId = rs2.getString("cr_itemid");
				            }
				            rs2.close();
				            pstmt2.close();
				            if ( strItemId.length() == 0 ) continue;
				            
				        	parmCnt = 0;
				        	strQuery.setLength(0);
							strQuery.append("select a.cr_rsrccd,a.cr_rsrcname,a.cr_jobcd,a.cr_lstver,a.cr_itemid,\n");
							strQuery.append("       a.cr_dsncd,a.cr_story,nvl(a.cr_viewver,'0.0.0.0') cr_viewver,\n");
							strQuery.append("       d.CM_INFO,lpad(d.cm_stepsta,4,'0') prcseq,                   \n");
							strQuery.append("       nvl(d.cm_vercnt,9999) vercnt,                                \n");
						    strQuery.append("       (select cm_dirpath from cmm0070                              \n");
						    strQuery.append("         where cm_syscd=a.cr_syscd                                  \n");
						    strQuery.append("           and cm_dsncd=a.cr_dsncd) cm_dirpath,                     \n");
						    strQuery.append("       (select cm_codename from cmm0020                             \n");
						    strQuery.append("         where cm_macode='CMR0020'                                  \n");
						    strQuery.append("           and cm_micode=a.cr_status) cm_codename,                  \n");
						    strQuery.append("       (select cm_codename from cmm0020                             \n");
						    strQuery.append("         where cm_macode='JAWON'                                    \n");
						    strQuery.append("           and cm_micode=a.cr_rsrccd) jawon,                        \n");
						    strQuery.append("       (select cr_aftviewver from cmr0021                           \n");
						    strQuery.append("         where cr_itemid=a.cr_itemid                   		     \n");
						    strQuery.append("           and cr_acptno=decode(?,'05',decode(?,'A',a.cr_acptno,'F',a.cr_acptno,'G',a.cr_acptno,'H',a.cr_acptno,a.cr_devacpt),'09',a.cr_testacpt,a.cr_realacpt)) befver,\n");
						    strQuery.append("       (select cr_version from cmr0021                              \n");
						    strQuery.append("         where cr_itemid=a.cr_itemid                  			     \n");
						    strQuery.append("           and cr_acptno=decode(?,'05',decode(?,'A',a.cr_acptno,'F',a.cr_acptno,'G',a.cr_acptno,'H',a.cr_acptno,a.cr_devacpt),'09',a.cr_testacpt,a.cr_realacpt)) version \n");
						    strQuery.append("  from cmr0020 a,cmm0036 d                                          \n");
						   	strQuery.append(" where a.cr_itemid=?                                                \n");
						   	strQuery.append("   and a.cr_syscd=d.cm_syscd and a.cr_rsrccd=d.cm_rsrccd            \n");
							pstmt2 = conn.prepareStatement(strQuery.toString());
							pstmt2 = new LoggableStatement(conn, strQuery.toString());
							pstmt2.setString(++parmCnt, etcData.get("SinCd"));
							pstmt2.setString(++parmCnt, fileList.get(i).get("cm_systype"));
							pstmt2.setString(++parmCnt, etcData.get("SinCd"));
							pstmt2.setString(++parmCnt, fileList.get(i).get("cm_systype"));
				            pstmt2.setString(++parmCnt, strItemId);
				            ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
				            rs2 = pstmt2.executeQuery();

				            if (rs2.next()) {
				            	rst = new HashMap<String,String>();
				    			rst.put("cm_dirpath",rs2.getString("cm_dirpath"));
				    			rst.put("view_dirpath",rs2.getString("cm_dirpath"));
				    			rst.put("cr_rsrcname",rs2.getString("cr_rsrcname"));
				    			rst.put("cr_story",rs2.getString("cr_story"));
				    			rst.put("jobname", fileList.get(i).get("jobname"));
				    			rst.put("jawon", rs2.getString("jawon"));
				    			rst.put("prcseq", rs2.getString("prcseq"));
				    			rst.put("editRow", rs2.getString("prcseq"));
				    			rst.put("cr_lstver",rs2.getString("cr_lstver"));

								if (rs2.getString("version") != null) {
									rst.put("cr_befver", rs2.getString("version"));
									rst.put("cr_befviewver", rs2.getString("befver"));
								} else {
									rst.put("cr_befver", "0");
									rst.put("cr_befviewver", rs2.getString("cr_viewver"));
								}
								
				    			rst.put("cr_itemid",rs2.getString("cr_itemid"));
				    			rst.put("sysgb", fileList.get(i).get("sysgb"));
				    			rst.put("cm_systype", fileList.get(i).get("cm_systype"));
				    			rst.put("cr_syscd", fileList.get(i).get("cr_syscd"));
				    			rst.put("cr_rsrccd",rs2.getString("cr_rsrccd"));
				    			rst.put("cr_dsncd",rs2.getString("cr_dsncd"));
				    			rst.put("cr_jobcd",fileList.get(i).get("cr_jobcd"));
				    			rst.put("baseitem",fileList.get(i).get("baseitem"));
				    			rst.put("sortgbn", "1");
				    			if (fileList.get(i).get("cr_sayu") != null && !"".equals(fileList.get(i).get("cr_sayu"))){
				    				rst.put("cr_sayu",fileList.get(i).get("cr_sayu"));
				    			}
								else{
									rst.put("cr_sayu",etcData.get("sayu"));
								}
				    			rst.put("cm_info",rs2.getString("cm_info"));
								rst.put("reqcd", fileList.get(i).get("reqcd"));
				    			rst.put("cr_acptno",fileList.get(i).get("cr_acptno"));
				    			rst.put("cr_baseno",fileList.get(i).get("cr_baseno"));
				    			
								rst.put("enable1","1");
								rst.put("selected","0");
				    			reqCnt = addCnt + 1;
								rst.put("seq", Integer.toString(reqCnt));
				    			rtList.add(addCnt++, rst);
				    			rst = null;
				            }
				            else {
								for (j=rtList.size()-1;j>=svCnt;j--) {
									rtList.remove(j);
								}
				            	strErr = "["+strRsrcName+"]에 대한 프로그램정보를 찾을 수가 없습니다.";
								rst = new HashMap<String,String>();
								rst.put("cr_itemid","ERROR");
								rst.put("cm_dirpath",strErr);
								rst.put("cr_rsrcname",fileList.get(i).get("cr_rsrcname"));
								rtList.add(svCnt, rst);
								rst = null;
								//ecamsLogger.error(strErr);
								ErrSw = true;
				            }
				            pstmt2.close();
				            rs2.close();
			            }			        }
			        rs.close();
			        pstmt.close();
				}
				if (ErrSw == false && fileList.get(i).get("cm_info").substring(8,9).equals("1")) {
					boolean modSw = false;
					int readCnt = 0;
					strQuery.setLength(0);
					strQuery.append("select count(*) cnt                                      \n");
					strQuery.append("  from cmm0036 a,cmm0037 b                               \n");
					strQuery.append(" where b.cm_syscd=? and b.cm_rsrccd=?                    \n");
					strQuery.append("   and b.cm_factcd='09'                                  \n");
					strQuery.append("   and b.cm_syscd=a.cm_syscd                             \n");
					strQuery.append("   and b.cm_samersrc=a.cm_rsrccd                         \n");
					strQuery.append("   and substr(a.cm_info,16,1)='0'                        \n");  //폐기대상
					pstmt2 = conn.prepareStatement(strQuery.toString());
//					pstmt2 =  new LoggableStatement(conn, strQuery.toString());
					pstmt2.setString(1, fileList.get(i).get("cr_syscd"));
			        pstmt2.setString(2, fileList.get(i).get("cr_rsrccd"));
//		            ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
			        rs2 = pstmt2.executeQuery();
			        
			        if (rs2.next()) {
			        	if (rs2.getInt("cnt") > 0) {
			        		modSw = true;
			        	}
			        }
			        rs2.close();
			        pstmt2.close();
			        
			        if (modSw) {
				        parmCnt = 0;
					   	strQuery.setLength(0);
					   	strQuery.append("select a.cr_rsrccd,a.cr_rsrcname,a.cr_jobcd,a.cr_lstver,a.cr_itemid,\n");
						strQuery.append("       a.cr_dsncd,a.cr_story,nvl(a.cr_viewver,'0.0.0.0') cr_viewver,\n");
						strQuery.append("       d.CM_INFO,lpad(d.cm_stepsta,4,'0') prcseq,                   \n");
						strQuery.append("       nvl(d.cm_vercnt,9999) vercnt,                                \n");
					    strQuery.append("       (select cm_dirpath from cmm0070                              \n");
					    strQuery.append("         where cm_syscd=a.cr_syscd                                  \n");
					    strQuery.append("           and cm_dsncd=a.cr_dsncd) cm_dirpath,                     \n");
					    strQuery.append("       (select cm_codename from cmm0020                             \n");
					    strQuery.append("         where cm_macode='CMR0020'                                  \n");
					    strQuery.append("           and cm_micode=a.cr_status) cm_codename,                  \n");
					    strQuery.append("       (select cm_codename from cmm0020                             \n");
					    strQuery.append("         where cm_macode='JAWON'                                    \n");
					    strQuery.append("           and cm_micode=a.cr_rsrccd) jawon,                        \n");
					    strQuery.append("       (select cr_aftviewver from cmr0021                           \n");
					    strQuery.append("         where cr_itemid=a.cr_itemid                   		     \n");
					    strQuery.append("           and cr_acptno=decode(?,'05',decode(?,'A',a.cr_acptno,'F',a.cr_acptno,'G',a.cr_acptno,'H',a.cr_acptno,a.cr_devacpt),'09',a.cr_testacpt,a.cr_realacpt)) befver,\n");
					    strQuery.append("       (select cr_version from cmr0021                              \n");
					    strQuery.append("         where cr_itemid=a.cr_itemid                  			     \n");
					    strQuery.append("           and cr_acptno=decode(?,'05',decode(?,'A',a.cr_acptno,'F',a.cr_acptno,'G',a.cr_acptno,'H',a.cr_acptno,a.cr_devacpt),'09',a.cr_testacpt,a.cr_realacpt)) version \n");
						strQuery.append("  from cmr0020 a,cmm0036 d,cmd0011 c                                \n");
					   	strQuery.append(" where c.cd_itemid=?                                                \n");
					   	strQuery.append("   and c.cd_prcitem=a.cr_itemid                                     \n");
					   	strQuery.append("   and a.cr_syscd=d.cm_syscd and a.cr_rsrccd=d.cm_rsrccd            \n");
					   	strQuery.append("   and substr(d.cm_info,16,1)='0'                                   \n");	 
						pstmt2 = conn.prepareStatement(strQuery.toString());
//						pstmt2 = new LoggableStatement(conn, strQuery.toString());
						pstmt2.setString(++parmCnt, etcData.get("SinCd"));
						pstmt2.setString(++parmCnt, fileList.get(i).get("cm_systype"));
						pstmt2.setString(++parmCnt, etcData.get("SinCd"));
						pstmt2.setString(++parmCnt, fileList.get(i).get("cm_systype"));
			            pstmt2.setString(++parmCnt, fileList.get(i).get("cr_itemid"));
//			            ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
			            rs2 = pstmt2.executeQuery();

			            while (rs2.next()) {
			            	rst = new HashMap<String,String>();
			    			rst.put("cm_dirpath",rs2.getString("cm_dirpath"));
			    			rst.put("view_dirpath",rs2.getString("cm_dirpath"));
			    			rst.put("cr_rsrcname",rs2.getString("cr_rsrcname"));
			    			rst.put("cr_story",rs2.getString("cr_story"));
			    			rst.put("jobname", fileList.get(i).get("jobname"));
			    			rst.put("jawon", rs2.getString("jawon"));
			    			rst.put("prcseq", rs2.getString("prcseq"));
			    			rst.put("editRow", rs2.getString("prcseq"));
			    			rst.put("cr_lstver",rs2.getString("cr_lstver"));

							if (rs2.getString("version") != null) {
								rst.put("cr_befver", rs2.getString("version"));
								rst.put("cr_befviewver", rs2.getString("befver"));
							} else {
								rst.put("cr_befver", "0");
								rst.put("cr_befviewver", rs2.getString("cr_viewver"));
							}
			    			rst.put("cr_itemid",rs2.getString("cr_itemid"));
			    			rst.put("sysgb", fileList.get(i).get("sysgb"));
			    			rst.put("cm_systype", fileList.get(i).get("cm_systype"));
			    			rst.put("cr_syscd", fileList.get(i).get("cr_syscd"));
			    			rst.put("cr_rsrccd",rs2.getString("cr_rsrccd"));
			    			rst.put("cr_dsncd",rs2.getString("cr_dsncd"));
			    			rst.put("cr_jobcd",fileList.get(i).get("cr_jobcd"));
			    			rst.put("baseitem",fileList.get(i).get("baseitem"));
			    			rst.put("sortgbn", "1");
			    			if (fileList.get(i).get("cr_sayu") != null && !"".equals(fileList.get(i).get("cr_sayu"))){
			    				rst.put("cr_sayu",fileList.get(i).get("cr_sayu"));
			    			}
							else{
								rst.put("cr_sayu",etcData.get("sayu"));
							}
			    			rst.put("cm_info",rs2.getString("cm_info"));
			    			rst.put("reqcd", fileList.get(i).get("reqcd"));
			    			rst.put("cr_acptno",fileList.get(i).get("cr_acptno"));
			    			rst.put("cr_baseno",fileList.get(i).get("cr_baseno"));
							rst.put("enable1","1");
							rst.put("selected","0");
			    			reqCnt = addCnt + 1;
			    			readCnt = 1;
							rst.put("seq", Integer.toString(reqCnt));
			    			rtList.add(addCnt++, rst);
			    			rst = null;
			            }
			            rs2.close();
			            pstmt2.close();
			        }
			        
				}    // 실행모듈체크 처리 end
				
				//ecamsLogger.error(rtList.get(i).get("cr_itemid")+","+rtList.get(i).get("baseitem"));
			}
			conn.close();
			//rtObj =  rtList.toArray();
			//ecamsLogger.error("+++++++++CHECK-IN LIST E N D+++"+rtList.toString());
			conn = null;
			
			return rtList.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0300.getDownCloseList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0300.getDownCloseList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0300.getDownCloseList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0300.getDownCloseList() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rtObj != null)	rtObj = null;
			if (rtList != null) rtList = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)     try{rs2.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.getDownCloseList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	public String request_Close(ArrayList<HashMap<String,String>> chkInList,HashMap<String,String> etcData,
			ArrayList<HashMap<String,String>> befJob,ArrayList<HashMap<String,Object>> ConfList,String confFg) throws SQLException, Exception {
			
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2      = null;
		PreparedStatement pstmt3      = null;
		ResultSet         rs          = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		int				  pstmtcount  = 1;
		AutoSeq			  autoseq	  = new AutoSeq();
		UserInfo		  userInfo	  = new UserInfo();
		String			  AcptNo	  = null;
		int				  i=0;
		boolean           findSw      = false;

		try {

			SysInfo sysinfo = new SysInfo();
			//신청 통제 시간인지 확인 작업
			if (sysinfo.getSysStopChk(etcData.get("UserID"), chkInList.get(0).get("cr_syscd")) == 1){
	        	sysinfo = null;
	        	return "ERROR[이관통제을 위하여 일시적으로 형상관리 사용을 중지합니다.(체크인신청)]";
			}
			sysinfo = null;

			conn = connectionContext.getConnection();
	        for (i=0;i<chkInList.size();i++){
	        	if ( chkInList.get(i).get("cr_itemid").equals( chkInList.get(i).get("baseitem") ) ) {
		        	strQuery.setLength(0);
		        	strQuery.append("select b.cm_codename,  \n");
	        		strQuery.append("       PGMSTACHK(?, 'BEF', c.cm_systype, a.cr_status, a.cr_lstver, a.cr_viewver) pgmsta \n");
		        	strQuery.append("  from cmr0020 a,cmm0020 b, cmm0030 c                      \n");
		        	strQuery.append(" where a.cr_itemid = ?                                     \n");
		        	strQuery.append("   and b.cm_macode='CMR0020' and b.cm_micode=a.cr_status   \n");
		        	strQuery.append("   and a.cr_syscd = c.cm_syscd   \n");
		        	pstmt = conn.prepareStatement(strQuery.toString());
		        	pstmt.setString(1, etcData.get("ReqCD"));
		        	pstmt.setString(2, chkInList.get(i).get("cr_itemid"));
		        	rs = pstmt.executeQuery();
		        	if ( rs.next() ){
		        		if (rs.getString("pgmsta").equals("NO")) {
		        			AcptNo = "ERROR["+ chkInList.get(i).get("cr_rsrcname") + "]는 요청가능한 상태가 아닙니다.[11] [" + rs.getString("cm_codename") +"]";
		        		}
		        	}
		        	rs.close();
		        	pstmt.close();
	        	}
	        }

	        if (AcptNo != null) {
	        	if (conn != null) conn.close();
	        	return AcptNo;
	        }

	        String strTeam = userInfo.getUserInfo_sub(conn,etcData.get("UserID"),"cm_project");
	        //ArrayList<HashMap<String,Object>> conflist = null;
	        int wkC = chkInList.size()/300;
	        int wkD = chkInList.size()%300;
	        if (wkD>0) wkC = wkC + 1;
            String svAcpt[] = null;
            svAcpt = new String [wkC];
            for (int j=0;wkC>j;j++) {
            	do {
    		        AcptNo = autoseq.getSeqNo(conn,etcData.get("ReqCD"));

    		        i = 0;
    		        strQuery.setLength(0);
    		        strQuery.append("select count(*) as cnt from cmr1000 \n");
    	        	strQuery.append(" where cr_acptno= ?                 \n");

    	        	pstmt = conn.prepareStatement(strQuery.toString());
    	        	pstmt.setString(1, AcptNo);

    	        	rs = pstmt.executeQuery();

    	        	if (rs.next()){
    	        		i = rs.getInt("cnt");
    	        	}
    	        	rs.close();
    	        	pstmt.close();
    	        } while(i>0);
            	svAcpt[j] = AcptNo;
            }
        	int    seq = 0;
        	int    j   = 0;
        	String retMsg = "";
            autoseq = null;
            conn.setAutoCommit(false);
        	boolean insSw = false;
        	
        	for (i=0;i<chkInList.size();i++){
        		insSw = false;
        		if (i == 0) insSw = true;
        		else {
        			wkC = i%300;
        			if (wkC == 0) insSw = true;
        		}
        		if (insSw == true) {
        			if (i>=300) {
        		        Cmr0200 cmr0200 = new Cmr0200();
        				retMsg = cmr0200.request_Confirm(AcptNo,chkInList.get(0).get("cr_syscd"),etcData.get("ReqCD"),etcData.get("UserID"),true,ConfList,conn);
        				cmr0200= null;
        				if (!retMsg.equals("OK")) {
        					conn.rollback();
        					conn.close();
        					throw new Exception("결재정보등록 중 오류가 발생하였습니다. 관리자에게 연락하여 주시기 바랍니다.");
        				}
        				conn.commit();
        				
        				conn.setAutoCommit(false);
        			}

        			wkC = i/300;
        			AcptNo = svAcpt[wkC];
        			//ecamsLogger.error("++++ i, wkC ++++++"+ Integer.toString(i)+", "+ Integer.toString(wkC));
        			pstmtcount = 1;
        			strQuery.setLength(0);
                	strQuery.append("insert into cmr1000 \n");
                	strQuery.append("(CR_ACPTNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,CR_ACPTDATE,CR_STATUS,CR_TEAMCD,CR_QRYCD, \n");
                	strQuery.append("CR_PASSOK,CR_PASSCD,CR_BEFJOB,CR_EMGCD,CR_EDITOR,CR_SAYU,CR_PASSSUB,CR_SAYUCD,  \n");
                	strQuery.append("CR_ECLIPSE,CR_PRCREQ,CR_CLOSEYN,CR_ITSMID,CR_ITSMTITLE) values ( \n");
                	strQuery.append("?,?,?,?,sysdate,'0',?,?,  ?,?,?,?,?,?,?,?,  'N',?,?,?,? ) \n");

                	//pstmt = conn.prepareStatement(strQuery.toString());
                	pstmt = new LoggableStatement(conn,strQuery.toString());
                	pstmt.setString(pstmtcount++, AcptNo);
                	pstmt.setString(pstmtcount++, chkInList.get(0).get("cr_syscd"));
                	pstmt.setString(pstmtcount++, chkInList.get(0).get("sysgb"));
                	pstmt.setString(pstmtcount++, chkInList.get(0).get("cr_jobcd"));
                	pstmt.setString(pstmtcount++, strTeam);
                	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));

                	pstmt.setString(pstmtcount++, etcData.get("Deploy"));
                	pstmt.setString(pstmtcount++, etcData.get("Sayu"));
                	//pstmt.setString(pstmtcount++, strRequest);
                	if (befJob.size() > 0) pstmt.setString(pstmtcount++, "Y");
                	else pstmt.setString(pstmtcount++, "N");
                	pstmt.setString(pstmtcount++, etcData.get("ReqSayu"));
                	pstmt.setString(pstmtcount++, etcData.get("UserID"));
                	pstmt.setString(pstmtcount++, etcData.get("txtSayu"));
                	pstmt.setString(pstmtcount++, etcData.get("EmgCd"));
                	pstmt.setString(pstmtcount++, etcData.get("PassCd"));

                	if (etcData.get("Deploy").equals("4")) {
                		pstmt.setString(pstmtcount++,etcData.get("AplyDate"));
                	} else {
                		pstmt.setString(pstmtcount++,"");
                	}
                	pstmt.setString(pstmtcount++, "Y");
                	pstmt.setString(pstmtcount++, etcData.get("cc_srid"));
                	pstmt.setString(pstmtcount++, etcData.get("cc_reqtitle"));
                	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
                	pstmt.executeUpdate();

                	pstmt.close();
                	seq = 0;
        		}
        		findSw = false;
        		strQuery.setLength(0);
        		strQuery.append("select count(*) cnt from cmr1010       \n");
        		strQuery.append(" where cr_acptno=?                     \n");
        		strQuery.append("   and cr_itemid=?                     \n");
            	pstmt = conn.prepareStatement(strQuery.toString());
            	pstmt.setString(1, AcptNo);
            	pstmt.setString(2, chkInList.get(i).get("cr_itemid"));
            	rs = pstmt.executeQuery();
            	if (rs.next()) {
            		if (rs.getInt("cnt") > 0) findSw = true;
            	}
            	rs.close();
            	pstmt.close();
            	
            	if (!findSw) {
	        		strQuery.setLength(0);
	            	strQuery.append("insert into cmr1010 ");
	            	strQuery.append("(CR_ACPTNO,CR_SERNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,CR_STATUS,CR_QRYCD,  \n");
	            	strQuery.append("CR_RSRCCD,CR_DSNCD,CR_RSRCNAME,CR_RSRCNAM2,CR_SRCCHG,CR_SRCCMP,     \n");
	            	strQuery.append("CR_PRIORITY,CR_APLYDATE,CR_VERSION,CR_BEFVER,CR_CONFNO,CR_EDITOR,   \n");
	            	strQuery.append("CR_BASENO,CR_BASEITEM,CR_ITEMID,CR_COACPT,CR_BASEPGM,CR_STORY,      \n");
	            	strQuery.append("CR_SYSTYPE,CR_BEFVIEWVER,CR_AFTVIEWVER) values \n");
	            	strQuery.append("(?,?,?,?,?,'0',?,  ?,?,?,?,'0','Y',  ?,?,?,?,?,?,  ?,?,?,?,?,?,?, ?,?)  \n");
	
	            	pstmtcount = 1;
	            	//pstmt = conn.prepareStatement(strQuery.toString());
	            	pstmt = new LoggableStatement(conn,strQuery.toString());
	
	            	pstmt.setString(pstmtcount++, AcptNo);
	            	pstmt.setInt(pstmtcount++, ++seq);
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_syscd"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("sysgb"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_jobcd"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("reqcd"));
	            	
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_rsrccd"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_dsncd"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_rsrcname"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_rsrcname"));
	            	
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("prcseq"));
	            	if (etcData.get("Deploy").equals("4")) {
	            		pstmt.setString(pstmtcount++,etcData.get("AplyDate"));
	            	} else {
	            		pstmt.setString(pstmtcount++,"");
	            	}
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_befver"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_befver"));
            		if (!"".equals(chkInList.get(i).get("cr_acptno")) && chkInList.get(i).get("cr_acptno") != null) {	
            			pstmt.setString(pstmtcount++,chkInList.get(i).get("cr_acptno"));
            		} else {
            			pstmt.setString(pstmtcount++,"");
            		}
	            	pstmt.setString(pstmtcount++, etcData.get("UserID"));
	            	if (!"".equals(chkInList.get(i).get("cr_baseno")) && chkInList.get(i).get("cr_baseno") != null) {	
            			pstmt.setString(pstmtcount++,chkInList.get(i).get("cr_baseno"));
            		} else {
            			pstmt.setString(pstmtcount++,"");
            		}
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("baseitem"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_itemid"));
	            	if (!"".equals(chkInList.get(i).get("cr_baseno")) && chkInList.get(i).get("cr_baseno") != null) {	
            			pstmt.setString(pstmtcount++,chkInList.get(i).get("cr_baseno"));
            		} else {
            			pstmt.setString(pstmtcount++,AcptNo);
            		}
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("baseitem"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_story"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cm_systype"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_befviewver"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_befviewver"));
	            	
	            	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	            	pstmt.executeUpdate();
	            	pstmt.close();
            	}
            	strQuery.setLength(0);
            	strQuery.append("insert into cmr1070 ");
            	strQuery.append("(CR_ACPTNO,CR_ITEMID,CR_BASEITEM)  \n");
            	strQuery.append("VALUES  \n");
            	strQuery.append("(?,?,?) \n");
            	pstmt = conn.prepareStatement(strQuery.toString());
            	pstmt.setString(1, AcptNo);
            	pstmt.setString(2, chkInList.get(i).get("cr_itemid"));
            	pstmt.setString(3, chkInList.get(i).get("baseitem"));
            	pstmt.executeUpdate();
            	pstmt.close();
        	}
	        Cmr0200 cmr0200 = new Cmr0200();
            retMsg = cmr0200.request_Confirm(AcptNo,chkInList.get(0).get("cr_syscd"),etcData.get("ReqCD"),etcData.get("UserID"),true,ConfList,conn);
			cmr0200 = null;
            if (!retMsg.equals("OK")) {
				conn.rollback();
				conn.close();
				throw new Exception("결재정보등록 중 오류가 발생하였습니다. 관리자에게 연락하여 주시기 바랍니다.");
			}
  	        
        	for (j=0;svAcpt.length>j;j++) {
        		strQuery.setLength(0);
        		strQuery.append("update cmr1010 set cr_confno=?                     \n");
        		strQuery.append(" where cr_acptno<>?                                \n");
        		strQuery.append("   and cr_itemid in (select cr_itemid from cmr1010 \n");
        		strQuery.append("                      where cr_acptno=?            \n");
        		strQuery.append("                     and cr_itemid=cr_baseitem)    \n");
        		if (etcData.get("cc_srid") != null && !"".equals(etcData.get("cc_srid"))) {
	        		strQuery.append("   and cr_acptno in (select cr_acptno from cmr1000 \n");
	        		strQuery.append("                      where cr_itsmid=?            \n");
	        		strQuery.append("                        and cr_prcdate is not null \n");
	        		strQuery.append("                        and cr_status<>'3')        \n");
        		} else {
            		strQuery.append("   and cr_status<>'3'                          \n");
            		strQuery.append("   and cr_prcdate is not null                  \n");
        		}
        		strQuery.append("   and cr_confno is null                           \n");
        		//pstmt = conn.prepareStatement(strQuery.toString());
            	pstmt = new LoggableStatement(conn, strQuery.toString());
                pstmt.setString(1, svAcpt[j]);
                pstmt.setString(2, svAcpt[j]);
                pstmt.setString(3, svAcpt[j]);
                if (etcData.get("cc_srid") != null && !"".equals(etcData.get("cc_srid"))) pstmt.setString(4, etcData.get("cc_srid"));
                ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
                pstmt.executeUpdate();
                pstmt.close();
        		
    			pstmtcount = 1;
    			strQuery.setLength(0);
    			strQuery.append("update cmr0020 a                 \n");
            	strQuery.append("   set a.cr_savesta=a.cr_status, \n");
            	strQuery.append("       a.cr_status=decode(?,'05','L','09','M','N')    \n");
            	strQuery.append(" where a.cr_itemid in (select cr_itemid from cmr1010  \n");
            	strQuery.append("                        where cr_acptno=?)            \n");
            	pstmt = conn.prepareStatement(strQuery.toString());
            	pstmt = new LoggableStatement(conn, strQuery.toString());
            	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
            	pstmt.setString(pstmtcount++, svAcpt[j]);
            	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            	pstmt.executeUpdate();
            	pstmt.close();
            	
            	for (i=0;i<befJob.size();i++){
                	strQuery.setLength(0);
                	strQuery.append("insert into cmr1030 ");
                	strQuery.append("(CR_ACPTNO,CR_BEFACT) values (?, ?) \n");

                	pstmtcount = 1;
                	pstmt = conn.prepareStatement(strQuery.toString());
                	//pstmt = new LoggableStatement(conn,strQuery.toString());

                	pstmt.setString(pstmtcount++, svAcpt[j]);
                	pstmt.setString(pstmtcount++, befJob.get(i).get("cr_befact"));
                	pstmt.executeUpdate();
                	pstmt.close();
            	}
        	}
        	if (etcData.get("cc_srid") != null && !"".equals(etcData.get("cc_srid")) && "10".equals(etcData.get("ReqCD"))) {
            	strQuery.setLength(0);
            	strQuery.append("update cmc0110 set cc_status='5'\n");
            	strQuery.append(" where cc_srid=?                \n");
            	strQuery.append("   and cc_userid=?              \n");
            	strQuery.append("   and cc_status<>'5'           \n");

            	pstmtcount = 1;
            	pstmt = conn.prepareStatement(strQuery.toString());
            	//pstmt = new LoggableStatement(conn,strQuery.toString());
            	pstmt.setString(pstmtcount++, etcData.get("cc_srid"));
            	pstmt.setString(pstmtcount++, etcData.get("UserID"));
            	pstmt.executeUpdate();
            	pstmt.close();
        	}
        	conn.commit();

        	conn.close();
        	rs = null;
        	pstmt = null;
        	rs2 = null;
        	pstmt2 = null;
        	pstmt3 = null;
        	conn = null;

        	//ecamsLogger.error("+++++++++Request E N D+++");
        	return AcptNo;

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)     try{rs2.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt3 != null)  try{pstmt3.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.request_Deploy() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmr0300.request_Deploy() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0300.request_Deploy() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)     try{rs2.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.request_Deploy() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmr0300.request_Deploy() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0300.request_Deploy() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)     try{rs2.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
//					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0300.request_Deploy() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	
}//end of Cmr0300 class statement
