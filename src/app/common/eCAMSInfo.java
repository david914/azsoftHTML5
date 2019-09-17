/*****************************************************************************************
	1. program ID	: eCAMSInfo.java
	2. create date	: 2007. 07. 23
	3. auth		    : k.m.s
	4. update date	: 
	5. auth		    : 
	6. description	: eCAMS Information
*****************************************************************************************/

package app.common;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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


public class eCAMSInfo{
	
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
	public String getFileInfo(String GbnCd) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		String            strPath     = null;
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();
			strQuery.append("select cm_path from cmm0012                     \n");
			strQuery.append("where cm_pathcd=?                               \n");		
            pstmt = conn.prepareStatement(strQuery.toString());	
            pstmt.setString(1, GbnCd);	
            rs = pstmt.executeQuery();
			if (rs.next()){
				strPath = rs.getString("cm_path");
				if (!strPath.substring(strPath.length() - 1, strPath.length()).equals("/"))
				    strPath = strPath + "/";	
			}//end of while-loop statement	
			
			rs.close();
			pstmt.close();
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			
			return strPath;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.getFileInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## eCAMSInfo.getFileInfo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.getFileInfo() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## eCAMSInfo.getFileInfo() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## eCAMSInfo.getFileInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getFileInfo() method statement

	public String getFileInfo_conn(String GbnCd,Connection conn) throws SQLException, Exception {
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		String            strPath     = null;
		
		try {
			strQuery.setLength(0);
			strQuery.append("select cm_path from cmm0012                     \n");
			strQuery.append("where cm_pathcd=?                               \n");		
            pstmt = conn.prepareStatement(strQuery.toString());	
            pstmt.setString(1, GbnCd);	
            rs = pstmt.executeQuery();
			if (rs.next()){
				strPath = rs.getString("cm_path");
				if (!strPath.substring(strPath.length() - 1, strPath.length()).equals("/"))
				    strPath = strPath + "/";	
			}//end of while-loop statement	
			
			rs.close();
			pstmt.close();
			rs = null;
			pstmt = null;
			
			return strPath;
			
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.getFileInfo_conn() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## eCAMSInfo.getFileInfo_conn() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.getFileInfo_conn() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## eCAMSInfo.getFileInfo_conn() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
		}
	}//end of getFileInfo_conn() method statement
	
	
    /** CMM0010 테이블 정보 조회
     * @return
     * @throws SQLException
     * @throws Exception
     */
    public HashMap<String, String> geteCAMSInfo() throws SQLException, Exception {
    	Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		HashMap<String, String>			  rst		  = null;

		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection(); 

			strQuery.setLength(0);
			strQuery.append("select cm_ipaddr,cm_port,cm_user,cm_passwd,cm_policypwd,cm_pwdcnt, \n");
			strQuery.append("       cm_pwdterm,cm_pwdcd,cm_ipaddr2,cm_initpwd,cm_tstpwd, \n");
			strQuery.append("       cm_proctot,cm_srcloc,cm_url,cm_addfilesize \n");
			strQuery.append("from cmm0010 \n");
			strQuery.append("where cm_stno='ECAMS' \n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
            rs = pstmt.executeQuery();
            rst = new HashMap<String, String>();
            
            if (rs.next())
            {
				rst.put("cm_ipaddr", rs.getString("cm_ipaddr"));
				rst.put("cm_port", rs.getString("cm_port"));
				rst.put("cm_user", rs.getString("cm_user"));
				rst.put("cm_passwd", rs.getString("cm_passwd"));
				rst.put("cm_policypwd", rs.getString("cm_policypwd"));
				rst.put("cm_pwdcnt", rs.getString("cm_pwdcnt"));
				rst.put("cm_pwdterm", rs.getString("cm_pwdterm"));
				rst.put("cm_pwdcd", rs.getString("cm_pwdcd"));
				rst.put("cm_ipaddr2", rs.getString("cm_ipaddr2"));
				rst.put("cm_initpwd", rs.getString("cm_initpwd"));
				rst.put("cm_tstpwd", rs.getString("cm_tstpwd"));
				if (rs.getString("cm_proctot") == null && rs.getString("cm_proctot") == ""){
					rst.put("cm_proctot", "50");
				}else{
					rst.put("cm_proctot", rs.getString("cm_proctot"));
				}
				rst.put("cm_srcloc", rs.getString("cm_srcloc"));
				rst.put("cm_url", rs.getString("cm_url"));
				rst.put("cm_addfilesize", rs.getString("cm_addfilesize"));
			}
            rs.close();
            pstmt.close();
            conn.close();
            
            rs = null;
            pstmt = null;
            conn = null;
            
            return rst;
            
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.geteCAMSInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## eCAMSInfo.geteCAMSInfo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.geteCAMSInfo() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## eCAMSInfo.geteCAMSInfo() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rst != null)	rst = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## eCAMSInfo.geteCAMSInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of geteCAMSInfo() method statement

    /** CMM0010 테이블 정보 조회
     * @return
     * @throws SQLException
     * @throws Exception
     */
    public String[] getNoName() throws SQLException, Exception {
    	Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		String  noName  = "";
		String  strWork1 = "";
		String  noNameAry[] = null;
		int j = 0;

		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection(); 

			strQuery.setLength(0);
			strQuery.append("select cm_noname from cmm0010 where cm_stno='ECAMS' and cm_noname is not null  \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				noName = rs.getString("cm_noname");
			}
			rs.close();
			pstmt.close();
			conn.close();
			
			/*  프로그램명 특수문자 확인     */
			if (noName.length()>0) {
				if (noName.length()>0) {
					for (j=0;noName.length()>j;j++) {
						if (!noName.substring(j,j+1).trim().equals("")) {
							if (strWork1.length()>0) strWork1 = strWork1 + ";";
							strWork1 = strWork1 + noName.substring(j,j+1);
						}
					}
					noNameAry = strWork1.split(";");
				}
			}
            
            
            rs = null;
            pstmt = null;
            conn = null;
            
            return noNameAry;
            
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.getNoName() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## eCAMSInfo.getNoName() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.getNoName() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## eCAMSInfo.getNoName() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (noNameAry != null)	noNameAry = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## eCAMSInfo.getNoName() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getNoName() method statement
    /** CMM0010 테이블 정보 조회
     * @return
     * @throws SQLException
     * @throws Exception
     */
    public String[] getNoName_conn(Connection conn) throws SQLException, Exception {
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		String  noName  = "";
		String  strWork1 = "";
		String  noNameAry[] = null;
		int j = 0;

		try {
			strQuery.setLength(0);
			strQuery.append("select cm_noname from cmm0010 where cm_stno='ECAMS' and cm_noname is not null  \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				noName = rs.getString("cm_noname");
			}
			rs.close();
			pstmt.close();
			
			/*  프로그램명 특수문자 확인     */
			if (noName.length()>0) {
				if (noName.length()>0) {
					for (j=0;noName.length()>j;j++) {
						if (!noName.substring(j,j+1).trim().equals("")) {
							if (strWork1.length()>0) strWork1 = strWork1 + ";";
							strWork1 = strWork1 + noName.substring(j,j+1);
						}
					}
					noNameAry = strWork1.split(";");
				}
			}
            
            
            rs = null;
            pstmt = null;
            conn = null;
            
            return noNameAry;
            
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.getNoName_conn() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## eCAMSInfo.getNoName_conn() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.getNoName_conn() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## eCAMSInfo.getNoName_conn() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (noNameAry != null)	noNameAry = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
		}
	}//end of getNoName_conn() method statement
    public int execShell_conn(String shFile,String parmName,boolean viewSw,Connection conn) throws Exception {
		String			  tmpPath = "";
		String			  strBinPath = "";
		File shfile=null;
		String  shFileName = "";
		OutputStreamWriter writer = null;
		String[] strAry = null;
		Runtime  run = null;
		Process p = null;

		String outFile = "";
		File outf = null;
		//ByteArrayOutputStream fileStream = null;
		
		try {

			SystemPath		  cTempGet	  = new SystemPath();
			tmpPath = cTempGet.getTmpDir_conn("99",conn);
			strBinPath = cTempGet.getTmpDir_conn("14",conn);
			cTempGet = null;
			
			shFileName = tmpPath + "/" + shFile; 			
			shfile = new File(shFileName);
			
			if( !(shfile.isFile()) )              //File존재여부
			{
				shfile.createNewFile();          //File생성
			}
			
			if (viewSw) {
				outFile = shFileName.replace(".sh", ".out"); 			
				outf = new File(outFile);
				
				if((outf.isFile()))              //File존재여부
				{
					outf.delete();         //File생성
				}
				parmName = parmName + " >"+outFile;
			}
			writer = new OutputStreamWriter( new FileOutputStream(shFileName));
			writer.write("cd "+strBinPath +"\n");
			writer.write(parmName+"\n");
			writer.write("exit $?\n");
			writer.close();
			
			strAry = new String[3];
			strAry[0] = "chmod";
			strAry[1] = "777";
			strAry[2] = shFileName;			
			
			run = Runtime.getRuntime();

			ecamsLogger.error("+++ server command execute +++"+parmName);
			p = run.exec(strAry);
			p.waitFor();
			
			run = Runtime.getRuntime();
			
			strAry = new String[2];
			
			strAry[0] = "/bin/sh";
			strAry[1] = shFileName;
			
			p = run.exec(strAry);
			p.waitFor();

			if (p.exitValue() == 0) {
				shfile.delete();
			}								
			return p.exitValue();	
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.execShell_conn() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## eCAMSInfo.execShell_conn() Exception END ##");				
			throw exception;
		}finally{
		}
	}//execShell
	
	public int execShell_ap_conn(String shFile,String parmName,boolean viewSw,Connection conn) throws Exception {
		String			  tmpPath = "";
		String			  strBinPath = "";
		File shfile=null;
		String  shFileName = "";
		OutputStreamWriter writer = null;
		String[] strAry = null;
		Runtime  run = null;
		Process p = null;

		String outFile = "";
		File outf = null;
		//ByteArrayOutputStream fileStream = null;
		
		try {
			SystemPath		  cTempGet	  = new SystemPath();
			tmpPath = cTempGet.getTmpDir_conn("99",conn);
			strBinPath = cTempGet.getTmpDir_conn("14",conn);
			String ecamsInfo = cTempGet.geteCAMSInfo_conn(conn);
			cTempGet = null;
			
			shFileName = tmpPath + "/" + shFile; 			
			shfile = new File(shFileName);
			
			if( !(shfile.isFile()) )              //File존재여부
			{
				shfile.createNewFile();          //File생성
			}
			
			if (viewSw) {
				outFile = shFileName.replace(".sh", ".out"); 			
				outf = new File(outFile);
				
				if((outf.isFile()))              //File존재여부
				{
					outf.delete();         //File생성
				}
				parmName = parmName + " >"+outFile;
			}
			writer = new OutputStreamWriter( new FileOutputStream(shFileName));
			writer.write("cd "+strBinPath +"\n");
			writer.write("./ecams_batexec "+ecamsInfo+ " \"cd "+strBinPath+ ";"+ parmName + "\" \n");
			writer.write("exit $?\n");
			writer.close();
			
			strAry = new String[3];
			strAry[0] = "chmod";
			strAry[1] = "777";
			strAry[2] = shFileName;			
			
			run = Runtime.getRuntime();

			
			p = run.exec(strAry);
			p.waitFor();
			
			run = Runtime.getRuntime();
			
			strAry = new String[2];
			
			strAry[0] = "/bin/sh";
			strAry[1] = shFileName;
			
			p = run.exec(strAry);
			p.waitFor();

			if (p.exitValue() == 0) {
				//shfile.delete();
			}								
			return p.exitValue();			
			
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## eCAMSInfo.execShell_ap_conn() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## eCAMSInfo.execShell_ap_conn() Exception END ##");				
			throw exception;
		}finally{
			//fileStr = fileStream.toString("EUC-KR");	
		}
	}//execShell_ap_conn
    
}//end of eCAMSInfo class statement
