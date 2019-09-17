/*****************************************************************************************
	1. program ID	: Cmm1600.java
	2. create date	: 2009. 01. 09
	3. auth		    : No Name
	4. update date	: 2009. 03. 04
	5. auth		    : No Name
	6. description	: [관리자] -> [일괄이행]
*****************************************************************************************/

package app.eCmm;

import java.io.BufferedWriter;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSetMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import org.apache.log4j.Logger;

import com.ecams.common.base.HttpCall;
import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Calendar;
import app.common.AutoSeq;
import app.common.LoggableStatement;
//import app.common.CodeInfo;
//import app.common.SystemPath;
import app.common.UserInfo;
import app.eCmr.Cmr0200;



/**
 * @author bigeyes
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class Cmm1600{

    /**
     * Logger Class Instance Creation
     * logger
     */

    Logger ecamsLogger  = EcamsLogger.getLoggerInstance();

    //String _baseItem	= "";

    public static void makeLogFile(String log,String fullpath){
		SimpleDateFormat formatter = new SimpleDateFormat ("yyyyMMddHHmmss");
		Calendar cal = Calendar.getInstance();
		String today = formatter.format(cal.getTime());
		String filename = fullpath+"/"+today+"_Cmm1600.log";
		try {
			BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(filename),"euc-kr"));
			bw.write(log);
			bw.newLine();
			bw.close();

		}catch(IOException ie){
			System.err.println("Error");
			System.exit(1);
		}
	}


    /**
	 * USER NAME
	 * @param user_id
	 * @return String
	 * @throws SQLException
	 * @throws Exception
	 */
	public Object[] getSvrInfo(String SysCd) throws SQLException, Exception {
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
			strQuery.append("select a.cm_svrcd,a.cm_svrip,a.cm_svrname,a.cm_volpath,a.cm_portno, \n");
			strQuery.append("       a.cm_sysos,a.cm_dir,b.cm_codename \n");
			strQuery.append("  from cmm0031 a,cmm0020 b \n");
			strQuery.append(" where a.cm_syscd=? \n");
			strQuery.append("   and a.cm_closedt is null \n");
			strQuery.append("   and a.cm_cmpsvr='Y' \n");
			strQuery.append("   and b.cm_macode='SERVERCD' and b.cm_micode=a.cm_svrcd \n");
			strQuery.append(" order by a.cm_svrname \n");

            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, SysCd);
            rs = pstmt.executeQuery();

			while (rs.next()){
				rst = new HashMap<String, String>();
				rst.put("cm_svrcd", rs.getString("cm_svrcd"));
				rst.put("cm_svrip", rs.getString("cm_svrip"));
				rst.put("cm_svrname", rs.getString("cm_svrname"));
				rst.put("cm_volpath", rs.getString("cm_volpath"));
				rst.put("cm_portno", rs.getString("cm_portno"));
				rst.put("cm_sysos", rs.getString("cm_sysos"));
				rst.put("cm_dir", rs.getString("cm_dir"));
				rst.put("cm_codename", rs.getString("cm_codename"));
				rst.put("svrname", rs.getString("cm_svrname") + "[" + rs.getString("cm_codename") + "]");
				rsval.add(rst);
				rst = null;
			}//end of while-loop statement

			rs.close();
			pstmt.close();
			conn.close();

			rs = null;
			pstmt = null;
			conn = null;

			return rsval.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmm1600.getSvrInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmm1600.getSvrInfo() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmm1600.getSvrInfo() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmm1600.getSvrInfo() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rsval != null)  rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1600.getSvrInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}


	public Object[] getFileList_excel(ArrayList<HashMap<String,String>> fileList,HashMap<String,String> dataObj) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;
		HashMap<String, String> tmpRst	  = null;

		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);

			String _syscd = dataObj.get("cm_syscd");
			String rsrcname = "";
			String userid = "";
			String _sourcename = "";
			String _jobcd = "";
			String _editor = "";
			String _dirpath = "";
			String _dsncd = "";
			String errMsg = "";
			boolean errSw = false;
			boolean tmpYN = false;
			String  exeName = "";
			String  noName  = "";
			String  strWork1 = "";
			String  noNameAry[] = null;
			
			strQuery.setLength(0);
			strQuery.append("select cm_noname from cmm0010 where cm_stno='ECAMS' and cm_noname is not null  \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			rs = pstmt.executeQuery();
			if (rs.next()) {
				noName = rs.getString("cm_noname");
			}
			rs.close();
			pstmt.close();

			int errCnt = 0;
			int i = 0;
			int j = 0;
			
			if (noName.length()>0) {
				for (i=0;noName.length()>i;i++) {
					if (!noName.substring(i,i+1).trim().equals("")) {
						if (strWork1.length()>0) strWork1 = strWork1 + ";";
						strWork1 = strWork1 + noName.substring(i,i+1);
					}
				}
				noNameAry = strWork1.split(";");
			}
			rsval.clear();
			for (i=0 ; i<fileList.size() ; i++)
			{
				rst = new HashMap<String, String>();
				rst.put("NO",Integer.toString(i+1));
				rst.put("sysmsg", fileList.get(i).get("sysmsg").trim());
				rst.put("jobcd", fileList.get(i).get("jobcd").trim());

				userid = "";
				if (fileList.get(i).get("userid") != null){
					userid = fileList.get(i).get("userid").trim();
				}
				rst.put("userid", userid);

				rsrcname = "";
				if (fileList.get(i).get("rsrcname") != null){
					rsrcname = fileList.get(i).get("rsrcname").trim();
				}
				rst.put("rsrcname", rsrcname);

				if (fileList.get(i).get("story") == null){
					tmpRst = new HashMap<String, String>();
					tmpRst.put("story", "");
					fileList.set(i, tmpRst);
					tmpRst = null;
				}
				rst.put("story", fileList.get(i).get("story").trim());

				if (fileList.get(i).get("dirpath") == null){
					tmpRst = new HashMap<String, String>();
					tmpRst.put("dirpath", "");
					fileList.set(i, tmpRst);
					tmpRst = null;
				}
				rst.put("dirpath", fileList.get(i).get("dirpath").trim());

				if (fileList.get(i).get("jawon") == null){
					tmpRst = new HashMap<String, String>();
					tmpRst.put("jawon", "");
					fileList.set(i, tmpRst);
					tmpRst = null;
				}
				rst.put("jawon", fileList.get(i).get("jawon").trim());

				rst.put("_syscd", _syscd);

				errMsg = "";
				errSw = false;
				_sourcename = rsrcname;
				_jobcd = "";
				_editor = "";
				_dirpath = "";
				_dsncd = "";

				if (fileList.get(i).get("jawon") == "" && fileList.get(i).get("jawon") == null){
					errMsg = "프로그램종류 입력없음/";
					errSw = true;
				}else{
					strQuery.setLength(0);
					strQuery.append("select a.cm_rsrccd,a.cm_info,a.cm_exename  \n");
					strQuery.append("  from cmm0036 a,cmm0020 b                 \n");
	                strQuery.append(" where a.cm_syscd=?                        \n");
	                strQuery.append("  and b.cm_macode='JAWON'                  \n");
	                strQuery.append("  and upper(b.cm_codename)=upper(?)        \n");
	                strQuery.append("  and a.cm_rsrccd=b.cm_micode              \n");

	                pstmt = conn.prepareStatement(strQuery.toString());
	                pstmt.setString(1, _syscd);
	                pstmt.setString(2, fileList.get(i).get("jawon").trim());
	                rs = pstmt.executeQuery();

	                if(rs.next()){
	                	//_rsrccd = rs.getString("cm_rsrccd");
	                	//strInfo = rs.getString("cm_info");
	                	rst.put("_rsrccd",rs.getString("cm_rsrccd"));
	                
	                	if (rs.getString("cm_exename") != null) {
	                		exeName = "";
	                		exeName = rsrcname.substring(rsrcname.lastIndexOf("."));
	                		if (exeName.length()>0) {
	                			if (rs.getString("cm_exename").indexOf(exeName)<0) {
	                				errMsg = errMsg + "확장자불일치";
	                				errSw = true;
	                			}
	                		}
	                	}
	                }else{
	                	errMsg = errMsg + "미등록 프로그램종류코드/";
	                	errSw = true;
	                }
					rs.close();
					pstmt.close();

					if (errSw == false) {
						strQuery.setLength(0);
						strQuery.append("select count(*) cnt from cmm0037 \n");
		                strQuery.append("where cm_syscd=?                 \n");
		                strQuery.append("  and cm_samersrc=?              \n");
		                strQuery.append("  and cm_factcd in ('04','27')   \n");

		                pstmt = conn.prepareStatement(strQuery.toString());
		                pstmt.setString(1, _syscd);
		                pstmt.setString(2, rst.get("_rsrccd"));
		                rs = pstmt.executeQuery();

		                if(rs.next()){
		                	if (rs.getInt("cnt")>0) {
			                	errMsg = errMsg + "동시적용또는자동생성항목/";
			                	errSw = true;
		                	}
		                }
						rs.close();
						pstmt.close();
					}
				}

				strQuery.setLength(0);
				strQuery.append("select cm_userid from cmm0040 \n");
				strQuery.append(" where (cm_userid=? or cm_username = ?) ");

                pstmt = conn.prepareStatement(strQuery.toString());
                pstmt.setString(1, userid);
                pstmt.setString(2, userid);
                rs = pstmt.executeQuery();

                if(rs.next()){
                	_editor = rs.getString("cm_userid");
                }else{
                	errMsg = errMsg + "미등록 사용자/";
                	_editor = "ADMIN";
                	//errSw = true;
                }
                rst.put("_editor",_editor);
				rs.close();
				pstmt.close();


				if (fileList.get(i).get("jobcd") == "" && fileList.get(i).get("jobcd") == null){
					errMsg = errMsg + "업무코드  입력없음/";
					errSw = true;
				}else{
					strQuery.setLength(0);
					strQuery.append("select cm_jobcd,cm_jobname from cmm0102 where ");
					strQuery.append("cm_jobcd=? or cm_jobname=? ");

	                pstmt = conn.prepareStatement(strQuery.toString());
	                pstmt.setString(1, fileList.get(i).get("jobcd").trim());
	                pstmt.setString(2, fileList.get(i).get("jobcd").trim());
	                rs = pstmt.executeQuery();

	                if(rs.next()){
	                	_jobcd = rs.getString("cm_jobcd");
	                    rst.put("_jobcd",rs.getString("cm_jobcd"));
	                    tmpYN = true;
	                }else{
	                	tmpYN = false;
	                	errMsg = errMsg + "미등록 업무코드/";
	                	errSw = true;
	                }
					rs.close();
					pstmt.close();

					if (tmpYN){
		            	strQuery.setLength(0);
		            	strQuery.append("select count(*) as cnt from cmm0034 where ");
		            	strQuery.append("cm_syscd=? and cm_jobcd=? ");

		                pstmt = conn.prepareStatement(strQuery.toString());
		                pstmt.setString(1, _syscd);
		                pstmt.setString(2, _jobcd);
		                rs = pstmt.executeQuery();

		                if (rs.next()){
		                	if (rs.getInt("cnt")==0){
		                		strQuery.setLength(0);
		                		strQuery.append("insert into cmm0034 (CM_SYSCD,CM_JOBCD,CM_CREATDT,CM_LASTDT,CM_EDITOR) ");
		                		strQuery.append("values (?,?,SYSDATE,SYSDATE,?) ");

		                		pstmt2 = conn.prepareStatement(strQuery.toString());
		                		pstmt2.setString(1,_syscd);
		                		pstmt2.setString(2,_jobcd);
		                		pstmt2.setString(3,_editor);
		                		pstmt2.executeUpdate();

		                		pstmt2.close();
		                	}
		                }
		                rs.close();
		                pstmt.close();
					}
				}
				
				//_baseItem = "";

				_dirpath = fileList.get(i).get("dirpath").trim();
				//if ( _dirpath.indexOf(".")>0) {
				//풀경로에 파일명이 마지막에 들어가 있는지 체크해서...
				if ( _dirpath.indexOf(".")>0 && _dirpath.substring(_dirpath.length()-_sourcename.length()).equals(_sourcename) ) {
					_dirpath = _dirpath.replace(_sourcename,"");
				}
				rst.put("_dirpath", _dirpath);
				rst.put("dirpath", _dirpath);
				if (_dirpath == "" & _dirpath == null){
					errMsg = errMsg + "프로그램경로 입력없음/";
					errSw = true;
				}
				if ( _dirpath.substring(_dirpath.length()-1).indexOf("/")>-1 ){
					_dirpath = _dirpath.substring(0, _dirpath.length()-1);
				}
                
				/*  프로그램명 특수문자 확인     */
				if (noName.length()>0) {
					for (j=0;noNameAry.length>j;j++) {
						if (_sourcename.indexOf(noNameAry[j])>=0){
							errMsg = errMsg + "프로그램명에 ["+noNameAry[j] + "]있음/";
							errSw = true;
							break;
						}
					}

					for (j=0;noNameAry.length>j;j++) {
						if (_dirpath.indexOf(noNameAry[j])>=0){
							errMsg = errMsg + "경로명에 ["+noNameAry[j] + "]있음/";
							errSw = true;
							break;
						}
					}
				}
				
				if (errSw == false) {
					rst.put("_dirpath", _dirpath);
					for (j=0;rsval.size()>j;j++) {
						if (rsval.get(j).get("_dirpath").equals(_dirpath) &&
							rsval.get(j).get("rsrcname").equals(_sourcename)) {
							++errCnt;
							errMsg = errMsg + "중복Data/";
							errSw = true;
							break;
						}
					}
				}

				if (errSw == true){//에러 있음
					++errCnt;
					rst.put("errsw", "1");
					rst.put("errmsg", errMsg);
				}else{
					strQuery.setLength(0);
					strQuery.append("select cm_dsncd from cmm0070 where cm_syscd=? ");
					strQuery.append("and cm_dirpath=? ");

					pstmt = conn.prepareStatement(strQuery.toString());
					//pstmt = new LoggableStatement(conn,strQuery.toString()) ;

					pstmt.setString(1, _syscd);
					pstmt.setString(2, _dirpath);

					//ecamsLogger.debug(((LoggableStatement)pstmt).getQueryString());
					rs  = pstmt.executeQuery();
					if (rs.next()){
						_dsncd = rs.getString("cm_dsncd");
					}else{
						_dsncd = "0000001";

						strQuery.setLength(0);
	                    strQuery.append("select lpad(max(cm_dsncd)+1,7,'0') max from cmm0070 where cm_syscd=? ");
	                    pstmt2 = conn.prepareStatement(strQuery.toString());
	                    pstmt2.setString(1, _syscd);
	                    rs2 = pstmt2.executeQuery();
	                    if (rs2.next()){
	                        if (rs2.getString("max") != null){
	                        	_dsncd = rs2.getString("max");
	        				}
	                    }
	                    rs2.close();
	                    pstmt2.close();

	                    strQuery.setLength(0);
	                    strQuery.append("insert into cmm0070 (CM_SYSCD,CM_DSNCD,CM_DIRPATH,CM_EDITOR,CM_OPENDT,CM_LASTUPDT) ");
	                    strQuery.append("values (?,?,?,'MASTER',SYSDATE,SYSDATE)");
	                    pstmt2 = conn.prepareStatement(strQuery.toString());
	                    pstmt2.setString(1, _syscd);
	                    pstmt2.setString(2, _dsncd);
	                    pstmt2.setString(3, _dirpath);
	                    pstmt2.executeUpdate();
	                    pstmt2.close();

					}
					rst.put("_dsncd",_dsncd);
					rs.close();
					pstmt.close();

					rst.put("story", fileList.get(i).get("story").replace("'", "''"));
					rst.put("_syscd",_syscd);

					strQuery.setLength(0);
					strQuery.append("select count(*) as cnt from cmm0044      \n");
					strQuery.append(" where cm_userid=? and cm_syscd=?        \n");
					strQuery.append("   and cm_jobcd=?                        \n");

					pstmt = conn.prepareStatement(strQuery.toString());
					pstmt.setString(1, rst.get("_editor"));
					pstmt.setString(2, _syscd);
					pstmt.setString(3, rst.get("_jobcd"));
					rs  = pstmt.executeQuery();
					if (rs.next()){
						if (rs.getInt("cnt")==0) {
							strQuery.setLength(0);
							strQuery.append("insert into cmm0044                      \n");
							strQuery.append("(cm_userid,cm_syscd,cm_jobcd,cm_creatdt) \n");
							strQuery.append("values (?, ?, ?, SYSDATE)                \n");
							pstmt2 = conn.prepareStatement(strQuery.toString());
							pstmt2.setString(1, rst.get("_editor"));
							pstmt2.setString(2, _syscd);
							pstmt2.setString(3, rst.get("_jobcd"));
							pstmt2.executeUpdate();
							pstmt2.close();
						}
					}
					rs.close();
					pstmt.close();
					//_baseItem = Cmr0020_Insert(conn,rst);

					strQuery.setLength(0);
					strQuery.append("select cr_itemid,cr_status,cr_lstver from cmr0020    ");
					strQuery.append(" where cr_syscd=? and cr_dsncd=? ");
					strQuery.append("   and cr_rsrcname=?             ");

					pstmt = conn.prepareStatement(strQuery.toString());
					//pstmt = new LoggableStatement(conn,strQuery.toString());

					pstmt.setString(1, _syscd);
					pstmt.setString(2, _dsncd);
					pstmt.setString(3, rst.get("rsrcname"));

					////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
					rs  = pstmt.executeQuery();
					if (rs.next()){
						if (errSw == false) {
			        		//_baseItem = rs.getString("cr_itemid");
							rst.put("_itemid", rs.getString("cr_itemid"));
							rst.put("errmsg","정상");
							rst.put("errsw", "0");

				        	strQuery.setLength(0);
			        		strQuery.append("update cmr0020   		    \n");
			        		strQuery.append("   set CR_RSRCCD=?         \n");
			        		strQuery.append("      ,CR_JOBCD=?		    \n");
			        		strQuery.append("      ,CR_STORY=?          \n");
			        		strQuery.append("      ,CR_LASTDATE=SYSDATE	\n");
			        		strQuery.append("      ,CR_EDITOR=?         \n");
			        		strQuery.append("      ,CR_LSTUSR=?         \n");
			        		strQuery.append("      ,CR_NOMODIFY=0	    \n");
			        		strQuery.append("      ,CR_LSTDAT=SYSDATE	\n");
			        		strQuery.append(" where cr_itemid=?         \n");
			        		pstmt2 = conn.prepareStatement(strQuery.toString());
			        		pstmt2.setString(1, rst.get("_rsrccd"));
			        		pstmt2.setString(2, rst.get("_jobcd"));
			        		pstmt2.setString(3, rst.get("story"));
			        		pstmt2.setString(4, rst.get("_editor"));
			        		pstmt2.setString(5, rst.get("_editor"));
			        		pstmt2.setString(6, rs.getString("cr_itemid"));
			        		pstmt2.executeUpdate();
			        		pstmt2.close();
						}
					}else{
						rst.put("_itemid", "insert");
						rst.put("errmsg","정상");
						rst.put("errsw", "0");
					}
			        rs.close();
			        pstmt.close();
				}
				rsval.add(rst);
				rst = null;
			}
			rs.close();
			pstmt.close();

			conn.commit();
			conn.close();

			rs = null;
			pstmt = null;
			conn = null;


			return rsval.toArray();


		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmm1600.getFileList_excel() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmm1600.getFileList_excel() SQLException END ##");
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
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmm1600.getFileList_excel() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmm1600.getFileList_excel() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rsval != null)	rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)     try{rs2.close();}catch (Exception ex1){ex1.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex3){ex3.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1600.getFileList_excel() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	public Object[] getModList_excel(ArrayList<HashMap<String,String>> fileList,HashMap<String,String> dataObj) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;

		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);

			String _syscd = dataObj.get("cm_syscd");
			String errMsg = "";
			String srcDsnCd = "";
//			String srcItemId = "";
			String modDsnCd = "";
//			String modItemId = "";
			String srcRsrcCd = "";
			String modRsrcCd = "";
			boolean errSw = false;
//			boolean tmpYN = false;

			int errCnt = 0;
			rsval.clear();
			for (int i=0 ; i<fileList.size() ; i++)
			{
				srcDsnCd = "";
//				srcItemId = "";
				modDsnCd = "";
//				modItemId = "";

				rst = new HashMap<String, String>();
				rst.put("NO",Integer.toString(i+1));
				rst.put("srcdir", fileList.get(i).get("srcdir").trim());
				rst.put("srcfile", fileList.get(i).get("srcfile").trim());
				rst.put("moddir", fileList.get(i).get("moddir").trim());
				rst.put("modfile", fileList.get(i).get("modfile").trim());
				rst.put("_syscd", _syscd);

				errMsg = "";
				errSw = false;

				if (fileList.get(i).get("srcdir") != null && !fileList.get(i).get("srcdir").equals("")) {
					strQuery.setLength(0);
					strQuery.append("select cm_dsncd from cmm0070 \n");
	                strQuery.append(" where cm_syscd=?            \n");
	                strQuery.append("   and cm_dirpath=?          \n");

	                pstmt = conn.prepareStatement(strQuery.toString());
	                pstmt.setString(1, _syscd);
	                pstmt.setString(2, fileList.get(i).get("srcdir").trim());
	                rs = pstmt.executeQuery();

	                if(rs.next()){
	                	rst.put("srcdsncd",rs.getString("cm_dsncd"));
	                	srcDsnCd = rs.getString("cm_dsncd");
	                }else{
	                	errMsg = errMsg + "미등록 프로그램 겅로";
	                	errSw = true;
	                }
					rs.close();
					pstmt.close();
				} else {
					errMsg = errMsg + "프로그램경로없음/";
                	errSw = true;
				}

				if (!errSw) {
					if (fileList.get(i).get("srcfile") != null && !fileList.get(i).get("srcfile").equals("")) {
						strQuery.setLength(0);
						strQuery.append("select cr_itemid,cr_rsrccd  \n");
						strQuery.append("  from cmr0020              \n");
		                strQuery.append(" where cr_syscd=?           \n");
		                strQuery.append("   and cr_dsncd=?           \n");
		                strQuery.append("   and cr_rsrcname=?        \n");

		                pstmt = conn.prepareStatement(strQuery.toString());
		                pstmt.setString(1, _syscd);
		                pstmt.setString(2, srcDsnCd);
		                pstmt.setString(3, fileList.get(i).get("srcfile").trim());
		                rs = pstmt.executeQuery();

		                if(rs.next()){
		                	rst.put("srcitemid",rs.getString("cr_itemid"));
//		                	srcItemId = rs.getString("cr_itemid");
		                	srcRsrcCd = rs.getString("cr_rsrccd");
		                }else{
		                	errMsg = errMsg + "미등록 프로그램/";
		                	errSw = true;
		                }
						rs.close();
						pstmt.close();
					} else {
						errMsg = errMsg + "프로그램없음/";
	                	errSw = true;
					}
				}

				if (fileList.get(i).get("moddir") != null && !fileList.get(i).get("moddir").equals("")) {
					strQuery.setLength(0);
					strQuery.append("select cm_dsncd from cmm0070 \n");
	                strQuery.append(" where cm_syscd=?            \n");
	                strQuery.append("   and cm_dirpath=?          \n");

	                pstmt = conn.prepareStatement(strQuery.toString());
	                pstmt.setString(1, _syscd);
	                pstmt.setString(2, fileList.get(i).get("moddir").trim());
	                rs = pstmt.executeQuery();

	                if(rs.next()){
	                	rst.put("moddsncd",rs.getString("cm_dsncd"));
	                	modDsnCd = rs.getString("cm_dsncd");
	                }else{
	                	errMsg = errMsg + "미등록 실행모듈경로/";
	                	errSw = true;
	                }
					rs.close();
					pstmt.close();
				} else {
					errMsg = errMsg + "실행모듈경로없음/";
                	errSw = true;
				}

				if (!errSw) {
					if (fileList.get(i).get("modfile") != null && !fileList.get(i).get("modfile").equals("")) {
						strQuery.setLength(0);
						strQuery.append("select cr_itemid,cr_rsrccd  \n");
						strQuery.append("  from cmr0020              \n");
		                strQuery.append(" where cr_syscd=?           \n");
		                strQuery.append("   and cr_dsncd=?           \n");
		                strQuery.append("   and cr_rsrcname=?        \n");

		                pstmt = conn.prepareStatement(strQuery.toString());
		                pstmt.setString(1, _syscd);
		                pstmt.setString(2, modDsnCd);
		                pstmt.setString(3, fileList.get(i).get("modfile").trim());
		                rs = pstmt.executeQuery();

		                if(rs.next()){
		                	rst.put("moditemid",rs.getString("cr_itemid"));
//		                	modItemId = rs.getString("cr_itemid");
		                	modRsrcCd = rs.getString("cr_rsrccd");
		                }else{
		                	errMsg = errMsg + "미등록 실행모듈/";
		                	errSw = true;
		                }
						rs.close();
						pstmt.close();
					} else {
						errMsg = errMsg + "실행모듈없음/";
	                	errSw = true;
					}
				}

				if (!errSw) {
					strQuery.setLength(0);
					strQuery.append("select count(*) cnt from cmm0037  \n");
	                strQuery.append(" where cm_syscd=?             \n");
	                strQuery.append("   and cm_rsrccd=?            \n");
	                strQuery.append("   and cm_samersrc=?          \n");

	                pstmt = conn.prepareStatement(strQuery.toString());
	                pstmt.setString(1, _syscd);
	                pstmt.setString(2, srcRsrcCd);
	                pstmt.setString(3, modRsrcCd);
	                rs = pstmt.executeQuery();

	                if(rs.next()){
	                	if (rs.getInt("cnt") == 0) {
		                	errMsg = errMsg + "프로그램유형확인/";
		                	errSw = true;
	                	}
	                }else{
	                	errMsg = errMsg + "프로그램유형확인/";
	                	errSw = true;
	                }
					rs.close();
					pstmt.close();
				}
				if (errSw == true){//에러 있음
					++errCnt;
					rst.put("errsw", "1");
					rst.put("errmsg", errMsg);
				}else{
					rst.put("errmsg","정상");
					rst.put("errsw", "0");
				}
				rsval.add(rst);
				rst = null;
			}
			rs.close();
			pstmt.close();

			conn.commit();
			conn.close();

			rs = null;
			pstmt = null;
			conn = null;

			return rsval.toArray();


		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmm1600.getModList_excel() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmm1600.getModList_excel() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmm1600.getModList_excel() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmm1600.getModList_excel() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rsval != null)	rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)     try{rs2.close();}catch (Exception ex1){ex1.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex3){ex3.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1600.getFileList_excel() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	public String request_Check_In(ArrayList<HashMap<String,String>> chkInList,HashMap<String,String> etcData) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		int				  pstmtcount  = 1;
		AutoSeq			  autoseq	  = new AutoSeq();
		UserInfo		  userInfo	  = new UserInfo();
		String			  AcptNo	  = null;
		String            strReqCd    = "";
		int				  i;
		int               lstVer     = 0;
		int               aftVer     = 0;
		int               prcSeq     = 0;
		HashMap<String,String>	rData = null;

		try {
			conn = connectionContext.getConnection();
			//ecamsLogger.debug("++++++++++List++"+etcData);
	        for (i=0;i<chkInList.size();i++){
	        	strReqCd = "03";
	        	lstVer = 0;
	        	aftVer = 1;

	        	if (!chkInList.get(i).get("_itemid").equals("insert")) {
		        	strQuery.setLength(0);
		        	strQuery.append("select a.cr_status,a.cr_editor,a.cr_nomodify,b.cm_codename,\n");
		        	strQuery.append("       a.cr_lstver,c.cm_info,c.cm_vercnt,c.cm_stepsta      \n");
		        	strQuery.append("  from cmr0020 a,cmm0020 b,cmm0036 c                       \n");
		        	strQuery.append(" where a.cr_itemid = ?                                     \n");
		        	strQuery.append("   and b.cm_macode='CMR0020' and b.cm_micode=a.cr_status   \n");
		        	strQuery.append("   and a.cr_syscd=c.cm_syscd and a.cr_rsrccd=c.cm_rsrccd   \n");

		        	pstmt = conn.prepareStatement(strQuery.toString());
//		        	pstmt =  new LoggableStatement(conn, strQuery.toString());
		        	
		        	pstmt.setString(1, chkInList.get(i).get("_itemid"));
//		        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
		        	
		        	rs = pstmt.executeQuery();
		        	if (rs.next()){
		        		if (!rs.getString("cr_status").equals("3") && !rs.getString("cr_status").equals("0")) {
		        			AcptNo = "ERROR["+ chkInList.get(i).get("rsrcname") + "]는 이미 요청가능한 상태가 아닙니다 . [" + rs.getString("cm_codename") +"]";
		        			break;
		        		} else {
		        			if (etcData.get("base").equals("3")) {
			        			if (rs.getInt("cr_lstver")>0) strReqCd = "04";
			        			else strReqCd = "03";
			        			lstVer = rs.getInt("cr_lstver");
			        			if (rs.getInt("cm_vercnt") == 0) {
									if (rs.getInt("cr_lstver") >= 9999) aftVer = 1;
									else aftVer = rs.getInt("cr_lstver")+1;
								} else {
									if (rs.getInt("cr_lstver") >= rs.getInt("cm_vercnt")) {
										aftVer = 1;
									} else aftVer = rs.getInt("cr_lstver")+1;
								}
		        			} else if (etcData.get("base").equals("1")) {
		        				strReqCd = "03";
		        				lstVer = 0;
		        				aftVer = 1;
		        			} else {
		        				strReqCd = "03";
		        				lstVer = 0;
		        				aftVer = 0;
		        			}
		        			prcSeq = rs.getInt("cm_stepsta");
		        		}
		        	}
		        	rs.close();
		        	pstmt.close();
	        	} else {
		        	strQuery.setLength(0);
		        	strQuery.append("select c.cm_info,c.cm_vercnt,c.cm_stepsta from cmm0036 c   \n");
		        	strQuery.append(" where c.cm_syscd=? and c.cm_rsrccd=?                      \n");
		        	pstmt = conn.prepareStatement(strQuery.toString());
//		        	pstmt =  new LoggableStatement(conn, strQuery.toString());
		        	
		        	pstmt.setString(1, etcData.get("cm_syscd"));
		        	pstmt.setString(2, chkInList.get(i).get("_rsrccd"));
//		        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
		        	
		        	rs = pstmt.executeQuery();
		        	if (rs.next()){
		        		prcSeq = rs.getInt("cm_stepsta");
		        	}
		        	rs.close();
		        	pstmt.close();

		        	if (etcData.get("base").equals("3") || etcData.get("base").equals("1")) {
        				strReqCd = "03";
        				lstVer = 0;
        				aftVer = 1;
        			} else {
        				strReqCd = "03";
        				lstVer = 0;
        				aftVer = 0;
        			}
	        	}
	        }
	        if (AcptNo != null) return AcptNo;

	        Object[] uInfo = userInfo.getUserInfo(etcData.get("UserID"));
        	rData = (HashMap<String, String>) uInfo[0];
        	String strTeam = rData.get("teamcd");
        	String strManId = rData.get("cm_manid");
        	String strQryCd = etcData.get("ReqCD");
        	rData = null;
        	uInfo = null;
        	String strTitle = "";
        	strQuery.setLength(0);
        	strQuery.append("select cm_codename from cmm0020     \n");
        	strQuery.append(" where cm_macode='REQUEST'          \n");
        	strQuery.append("   and cm_micode=?                  \n");
        	pstmt = conn.prepareStatement(strQuery.toString());
//        	pstmt =  new LoggableStatement(conn, strQuery.toString());
        	pstmt.setString(1, etcData.get("ReqCD"));
//        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
        	rs = pstmt.executeQuery();
        	if (rs.next()){
        		strTitle = rs.getString("cm_codename");
        	}
        	rs.close();
        	pstmt.close();

	        int wkC = chkInList.size()/300;
	        int wkD = chkInList.size()%300;
	        if (wkD>0) wkC = wkC + 1;
            String svAcpt[] = null;
            svAcpt = new String [wkC];
            for (int j=0;wkC>j;j++) {
            	do {
    		        AcptNo = autoseq.getSeqNo(conn,strQryCd);

    		        i = 0;
    		        strQuery.setLength(0);
    		        strQuery.append("select count(*) as cnt from cmr1000 \n");
    	        	strQuery.append(" where cr_acptno= ?                 \n");

    	        	pstmt = conn.prepareStatement(strQuery.toString());
//    	        	pstmt =  new LoggableStatement(conn, strQuery.toString());
    	        	
    	        	pstmt.setString(1, AcptNo);
//    	        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
    	        	
    	        	rs = pstmt.executeQuery();

    	        	if (rs.next()){
    	        		i = rs.getInt("cnt");
    	        	}
    	        	rs.close();
    	        	pstmt.close();
    	        } while(i>0);
            	svAcpt[j] = AcptNo;
            }
            autoseq = null;
            conn.setAutoCommit(false);
        	boolean insSw = false;
        	int seqCnt = 0;
        	for (i=0;i<chkInList.size();i++){
        		insSw = false;
        		if (i == 0) insSw = true;
        		else {
        			wkC = i%300;
        			if (wkC == 0) insSw = true;
        		}

        		if (insSw == true) {
        			if (i>=300) {
        	        	strQuery.setLength(0);
        	        	strQuery.append("insert into cmr9900 ");
        	        	strQuery.append("(CR_ACPTNO,CR_SEQNO,CR_LOCAT,CR_CONFNAME,CR_TEAM,CR_TEAMCD,CR_STATUS,CR_CONGBN, ");
        	        	strQuery.append("CR_COMMON, CR_BLANK,CR_EMGER,CR_HOLI,CR_SGNGBN,CR_ORGSTEP,CR_BASEUSR, CR_PRCSW) ");
        	        	strQuery.append("(SELECT ?,1,lpad(CM_seqno,2,'0'),CM_NAME,decode(CM_JOBCD,null,'MASTER',CM_JOBCD) CM_JOBCD,CM_GUBUN, ");
        	        	strQuery.append("'0',CM_COMMON,CM_COMMON,CM_BLANK,CM_EMG,CM_HOLIDAY,CM_POSITION, CM_ORGSTEP,decode(CM_JOBCD,null,'MASTER',CM_JOBCD) CM_JOBCD,CM_PRCSW ");
        	        	strQuery.append("FROM CMm0060 ");
        	        	strQuery.append("WHERE CM_SYSCD= ? ");
        	        	strQuery.append("AND CM_REQCD= ? ");

        	        	if (strManId.equals("N")){
        	        		strQuery.append("AND CM_MANID='2') ");
        	        	}
        	        	else{
        	        		strQuery.append("AND CM_MANID='1') ");
        	        	}

        	        	//strQuery.append("AND CM_GUBUN='1') ");

        	        	pstmt = conn.prepareStatement(strQuery.toString());
//        	        	pstmt =  new LoggableStatement(conn, strQuery.toString());
        	        	pstmtcount = 1;
        	        	pstmt.setString(pstmtcount++, AcptNo);
        	        	pstmt.setString(pstmtcount++, chkInList.get(0).get("_syscd"));
        	        	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
//        	        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
        	        	pstmt.executeUpdate();
        	        	pstmt.close();


        	        	strQuery.setLength(0);

        	        	strQuery.append("update cmr9900 set cr_team=?,cr_baseusr=?          ");
        	        	strQuery.append(" where cr_acptno=? and cr_teamcd='2'               ");

        	        	pstmt = conn.prepareStatement(strQuery.toString());
//        	        	pstmt =  new LoggableStatement(conn, strQuery.toString());
        	        	pstmtcount = 1;
        	        	pstmt.setString(pstmtcount++, etcData.get("UserID"));
        	        	pstmt.setString(pstmtcount++, etcData.get("UserID"));
        	        	pstmt.setString(pstmtcount++, AcptNo);
//        	        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());

        	        	pstmt.executeUpdate();
        	        	pstmt.close();

        	        	strQuery.setLength(0);

        	        	strQuery.append("insert into cmr9900 ");
        	        	strQuery.append("(CR_ACPTNO,CR_SEQNO,CR_LOCAT,CR_STATUS,CR_CONFUSR) ");
        	        	strQuery.append("values ( ");
        	        	strQuery.append("?, '1', '00', '0', '9999' ) ");

        	        	pstmt = conn.prepareStatement(strQuery.toString());
//        	        	pstmt =  new LoggableStatement(conn, strQuery.toString());
        	        	
        	        	pstmtcount = 1;
        	        	pstmt.setString(pstmtcount++, AcptNo);
//        	        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());

        	        	pstmt.executeUpdate();
        	        	pstmt.close();

        	        	strQuery.setLength(0);

        	        	strQuery.append("Begin CMR9900_STR ( ");
        	        	strQuery.append("?, '000000', '', '9', ?, '1' ); End;");
        	        	pstmt = conn.prepareStatement(strQuery.toString());
//        	        	pstmt =  new LoggableStatement(conn, strQuery.toString());
        	        	
        	        	pstmtcount = 1;
        	        	pstmt.setString(pstmtcount++, AcptNo);
        	        	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
//        	        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());

        	        	pstmt.executeUpdate();
        	        	pstmt.close();
        			}
        			wkC = i/300;
        			AcptNo = svAcpt[wkC];
        			//ecamsLogger.debug("+++++++++AcptNo++++++"+AcptNo);
        			pstmtcount = 1;
                	strQuery.setLength(0);
                	strQuery.append("insert into cmr1000 ");
                	strQuery.append("(CR_ACPTNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,CR_ACPTDATE,CR_STATUS,CR_TEAMCD,CR_QRYCD, ");
                	strQuery.append("CR_PASSOK,CR_PASSCD,CR_BEFJOB,CR_EMGCD,CR_EDITOR,CR_SAYU,CR_PASSSUB,CR_SAYUCD, ");
                	strQuery.append("CR_SVRCD,CR_SVRSEQ) values ( ");
                	strQuery.append("?,?,?,?,sysdate,'0',?,?,   '0',?,'N','11',?,'일괄등록',?,'',  ?,?) ");

                	pstmt = conn.prepareStatement(strQuery.toString());
//                	pstmt = new LoggableStatement(conn,strQuery.toString());

                	pstmt.setString(pstmtcount++, AcptNo);
                	pstmt.setString(pstmtcount++, etcData.get("cm_syscd"));
                	pstmt.setString(pstmtcount++, etcData.get("sysgb"));
                	pstmt.setString(pstmtcount++, chkInList.get(0).get("_jobcd"));
                	pstmt.setString(pstmtcount++, strTeam);
                	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));

                	pstmt.setString(pstmtcount++, strTitle);
                	pstmt.setString(pstmtcount++, etcData.get("UserID"));
                	pstmt.setString(pstmtcount++, etcData.get("base"));//CR_PASSSUB

                	pstmt.setString(pstmtcount++, etcData.get("svrcd"));
                	pstmt.setInt(pstmtcount++, Integer.parseInt(etcData.get("svrseq")));

//                	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
                	pstmt.executeUpdate();

                	pstmt.close();
                	seqCnt = 0;
        		}
            	strQuery.setLength(0);
            	strQuery.append("insert into cmr1010 ");
            	strQuery.append("(CR_ACPTNO,CR_SERNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,CR_STATUS,CR_QRYCD, \n");
            	strQuery.append(" CR_RSRCCD,CR_DSNCD,CR_RSRCNAME,CR_RSRCNAM2,CR_SRCCHG,CR_SRCCMP,   \n");
            	strQuery.append(" CR_PRIORITY,CR_VERSION,CR_BEFVER,CR_CONFNO,CR_EDITOR,CR_BASENO,   \n");
            	strQuery.append(" CR_BASEITEM,CR_ITEMID,CR_EDITCON,CR_SYSTYPE,CR_BEFVIEWVER,        \n");
            	strQuery.append(" CR_AFTVIEWVER)    \n");
            	strQuery.append(" values            \n");
            	strQuery.append("(?,?,?,?,?,'0',?,  \n");
            	strQuery.append(" ?,?,?,?,?,'Y',    \n");
            	strQuery.append(" ?,?,?,?,?,?,      \n");
            	strQuery.append(" ?,?,?,?,'0.0.0.0',\n");
            	strQuery.append(" ?)                \n");

            	pstmtcount = 1;
            	pstmt = conn.prepareStatement(strQuery.toString());
//            	pstmt = new LoggableStatement(conn,strQuery.toString());

            	pstmt.setString(pstmtcount++, AcptNo);
            	pstmt.setInt(pstmtcount++, ++seqCnt);
            	pstmt.setString(pstmtcount++, etcData.get("cm_syscd"));
            	pstmt.setString(pstmtcount++, etcData.get("sysgb"));
            	pstmt.setString(pstmtcount++, chkInList.get(i).get("_jobcd"));
            	pstmt.setString(pstmtcount++, strReqCd);

            	pstmt.setString(pstmtcount++, chkInList.get(i).get("_rsrccd"));
            	//pstmt.setString(pstmtcount++, chkInList.get(i).get("_langcd"));
            	pstmt.setString(pstmtcount++, chkInList.get(i).get("_dsncd"));
            	pstmt.setString(pstmtcount++, chkInList.get(i).get("rsrcname"));
            	pstmt.setString(pstmtcount++, chkInList.get(i).get("rsrcname"));
            	if (strReqCd.equals("04") || strReqCd.equals("03")) {
            		pstmt.setString(pstmtcount++,"1");
            	} else {
            		pstmt.setString(pstmtcount++,"0");
            	}

            	pstmt.setInt(pstmtcount++, prcSeq);
            	pstmt.setInt(pstmtcount++, aftVer);
            	pstmt.setInt(pstmtcount++, lstVer);
            	pstmt.setString(pstmtcount++,AcptNo);
            	//pstmt.setString(pstmtcount++, etcData.get("UserID"));
            	pstmt.setString(pstmtcount++, chkInList.get(i).get("_editor"));

//            	pstmt.setString(pstmtcount++,chkInList.get(i).get("cr_acptno"));
            	pstmt.setString(pstmtcount++,AcptNo);
            	if (chkInList.get(i).get("_itemid") != null && chkInList.get(i).get("_itemid") != "" &&
            		!chkInList.get(i).get("_itemid").equals("insert")) {
            		pstmt.setString(pstmtcount++, chkInList.get(i).get("_itemid"));
                	pstmt.setString(pstmtcount++, chkInList.get(i).get("_itemid"));
            	} else {
            		pstmt.setString(pstmtcount++, "");
                	pstmt.setString(pstmtcount++, "");
            	}
            	pstmt.setString(pstmtcount++, chkInList.get(i).get("story"));
            	pstmt.setString(pstmtcount++, etcData.get("cm_systype"));
            	if ("1".equals(etcData.get("base"))) pstmt.setString(pstmtcount++,"0.0.0.1");
            	else pstmt.setString(pstmtcount++,"0.0.0.0");
            	//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            	pstmt.executeUpdate();
            	pstmt.close();

            	if (chkInList.get(i).get("_itemid") != null && chkInList.get(i).get("_itemid") != "" &&
            		!chkInList.get(i).get("_itemid").equals("insert")) {
	            	pstmtcount = 1;
	            	strQuery.setLength(0);
	            	strQuery.append("update cmr0020 set cr_status='K',            \n");
	            	// 최초이행이나 목록이행일 경우 기록 삭제 버전=0
	            	if (etcData.get("base").equals("1") || etcData.get("base").equals("2")) {
	            		strQuery.append("cr_lstver=0,                            \n");
	            		strQuery.append("cr_viewver='0.0.0.0'                    \n");
	            	}
	            	strQuery.append("cr_editor=?,                                \n");
	            	strQuery.append("cr_lastdate=sysdate                         \n");

	            	strQuery.append("where cr_itemid= ?                          \n");

	            	pstmt = conn.prepareStatement(strQuery.toString());
//	            	pstmt =  new LoggableStatement(conn, strQuery.toString());

	            	//pstmt.setString(pstmtcount++, etcData.get("UserID"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("userid"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_itemid"));
//	            	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	            	
	            	pstmt.executeUpdate();
	            	pstmt.close();
	            	// 최초이행이나 목록이행일 경우 기록 삭제
	            	if (etcData.get("base").equals("1") || etcData.get("base").equals("2")) {
	            		strQuery.setLength(0);
	            		strQuery.append("delete cmr0021 where cr_itemid=?    \n");
	            		pstmt = conn.prepareStatement(strQuery.toString());
//	            		pstmt =  new LoggableStatement(conn, strQuery.toString());
	            		
		            	pstmt.setString(1, chkInList.get(i).get("cr_itemid"));
//		            	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
		            	
		            	pstmt.executeUpdate();
		            	pstmt.close();

	            		strQuery.setLength(0);
	            		strQuery.append("delete cmr0025 where cr_itemid=?    \n");
	            		pstmt = conn.prepareStatement(strQuery.toString());
//	            		pstmt =  new LoggableStatement(conn, strQuery.toString());
	            		
		            	pstmt.setString(1, chkInList.get(i).get("cr_itemid"));
//		            	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
		            	
		            	pstmt.executeUpdate();
		            	pstmt.close();
	            	}
            	}
        	}

        	strQuery.setLength(0);
        	strQuery.append("insert into cmr9900 ");
        	strQuery.append("(CR_ACPTNO,CR_SEQNO,CR_LOCAT,CR_CONFNAME,CR_TEAM,CR_TEAMCD,CR_STATUS,CR_CONGBN, ");
        	strQuery.append("CR_COMMON, CR_BLANK,CR_EMGER,CR_HOLI,CR_SGNGBN,CR_ORGSTEP,CR_BASEUSR, CR_PRCSW) ");
        	strQuery.append("(SELECT ?,1,lpad(CM_seqno,2,'0'),CM_NAME,decode(CM_JOBCD,null,'MASTER',CM_JOBCD) CM_JOBCD,CM_GUBUN, ");
        	strQuery.append("'0',CM_COMMON,CM_COMMON,CM_BLANK,CM_EMG,CM_HOLIDAY,CM_POSITION, CM_ORGSTEP,decode(CM_JOBCD,null,'MASTER',CM_JOBCD) CM_JOBCD,CM_PRCSW ");
        	strQuery.append("FROM CMm0060 ");
        	strQuery.append("WHERE CM_SYSCD= ? ");
        	strQuery.append("AND CM_REQCD= ? ");

        	if (strManId.equals("N")){
        		strQuery.append("AND CM_MANID='2' ");
        	}
        	else{
        		strQuery.append("AND CM_MANID='1' ");
        	}
        	strQuery.append(") ");
        	//strQuery.append("AND CM_GUBUN='1') ");

        	pstmt = conn.prepareStatement(strQuery.toString());
//        	pstmt =  new LoggableStatement(conn, strQuery.toString());
        	pstmtcount = 1;
        	pstmt.setString(pstmtcount++, AcptNo);
        	pstmt.setString(pstmtcount++, chkInList.get(0).get("_syscd"));
        	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
//        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
        	pstmt.executeUpdate();
        	pstmt.close();

        	strQuery.setLength(0);

        	strQuery.append("insert into cmr9900 ");
        	strQuery.append("(CR_ACPTNO,CR_SEQNO,CR_LOCAT,CR_STATUS,CR_CONFUSR) ");
        	strQuery.append("values ( ");
        	strQuery.append("?, '1', '00', '0', '9999' ) ");

        	pstmt = conn.prepareStatement(strQuery.toString());
//        	pstmt =  new LoggableStatement(conn, strQuery.toString());
        	
        	pstmtcount = 1;
        	pstmt.setString(pstmtcount++, AcptNo);
//        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
        	
        	pstmt.executeUpdate();
        	pstmt.close();

        	strQuery.setLength(0);
        	strQuery.append("Begin CMR9900_STR ( ");
        	strQuery.append("?, '000000', '', '9', ?, '1' ); End;");
        	pstmt = conn.prepareStatement(strQuery.toString());
//        	pstmt =  new LoggableStatement(conn, strQuery.toString());
        	
        	pstmtcount = 1;
        	pstmt.setString(pstmtcount++, AcptNo);
        	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
//        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
        	
        	pstmt.executeUpdate();

        	pstmt.close();
        	conn.commit();
        	uInfo = null;
        	conn = null;
			pstmt = null;
			rs = null;
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
					ecamsLogger.error("## Cmm1600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmm1600.request_Check_In() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmm1600.request_Check_In() SQLException END ##");
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
					ecamsLogger.error("## Cmm1600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmm1600.request_Check_In() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmm1600.request_Check_In() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	
	
	/** 프로그램설명  일괄 업데이트 작업 엑셀 로드
	 * @param fileList
	 * @param dataObj
	 * @return
	 * @throws SQLException
	 * @throws Exception
	 */
	public Object[] getProgramList_excel(ArrayList<HashMap<String,String>> fileList,HashMap<String,String> dataObj) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String> rst	  = null;
		HashMap<String, String> tmpRst	  = null;

		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);

			String _syscd = dataObj.get("cm_syscd");
			String rsrcname = "";
			String _sourcename = "";
			String _dirpath = "";
			String _story = "";
			String _dsncd = "";
			String errMsg = "";

			int i = 0;
			int j = 0;
			
			for (i=0 ; i<fileList.size() ; i++){
				
				rst = new HashMap<String, String>();
				rst.put("NO",Integer.toString(i+1));
				rst.put("sysmsg", fileList.get(i).get("sysmsg").trim());
				rst.put("_syscd",_syscd);
				
				rsrcname = "";
				if (fileList.get(i).get("rsrcname") != null){
					rsrcname = fileList.get(i).get("rsrcname").trim();
				}
				rst.put("rsrcname", rsrcname);

				if (fileList.get(i).get("dirpath") == null){
					tmpRst = new HashMap<String, String>();
					tmpRst.put("dirpath", "");
					fileList.set(i, tmpRst);
					tmpRst = null;
				}
				rst.put("dirpath", fileList.get(i).get("dirpath").trim());
				rst.put("_syscd", _syscd);

				errMsg = "";
				_sourcename = rsrcname;
				_dirpath = "";
				_dsncd = "";


				_dirpath = fileList.get(i).get("dirpath").trim();
				//if ( _dirpath.indexOf(".")>0) {
				//풀경로에 파일명이 마지막에 들어가 있는지 체크해서...
				if ( _dirpath.indexOf(".")>0 && _dirpath.substring(_dirpath.length()-_sourcename.length()).equals(_sourcename) ) {
					_dirpath = _dirpath.replace(_sourcename,"");
				}
				rst.put("_dirpath", _dirpath);
				rst.put("dirpath", _dirpath);
				if (_dirpath == "" & _dirpath == null){
					errMsg = errMsg + "프로그램경로 입력없음/";
					rst.put("errsw", "1");
					rst.put("errmsg", errMsg);
				}
				if ( _dirpath.substring(_dirpath.length()-1).indexOf("/")>-1 ){
					_dirpath = _dirpath.substring(0, _dirpath.length()-1);
				}
                
				if ( _dirpath.length() > 0 ) {
					rst.put("_dirpath", _dirpath);
					for (j=0;rsval.size()>j;j++) {
						if (rsval.get(j).get("_dirpath").equals(_dirpath) &&
							rsval.get(j).get("rsrcname").equals(_sourcename)) {
							errMsg = errMsg + "중복Data/";
							rst.put("errsw", "1");
							rst.put("errmsg", errMsg);
							break;
						}
					}
				}

				strQuery.setLength(0);
				strQuery.append("select cm_dsncd from cmm0070 where cm_syscd=? ");
				strQuery.append("and cm_dirpath=? ");

				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString()) ;
				pstmt.setString(1, _syscd);
				pstmt.setString(2, _dirpath);
				//ecamsLogger.debug(((LoggableStatement)pstmt).getQueryString());
				rs  = pstmt.executeQuery();
				if (rs.next()){
					_dsncd = rs.getString("cm_dsncd");
				}else{
					errMsg = errMsg + "프로그램경로 DSNCD없음/";
					rst.put("errsw", "1");
					rst.put("errmsg", errMsg);
				}
				rst.put("_dsncd",_dsncd);
				rs.close();
				pstmt.close();
				
				_story = fileList.get(i).get("story").replace("'", "''").trim();
				if ( _story == "" & _story == null){
					errMsg = errMsg + "프로그램설명 입력없음/";
					rst.put("errsw", "1");
					rst.put("errmsg", errMsg);
				} else {
					rst.put("story", _story );
				}

				strQuery.setLength(0);
				strQuery.append("select cr_itemid from cmr0020 \n");
				strQuery.append(" where cr_syscd=? and cr_dsncd=? \n");
				strQuery.append("   and cr_rsrcname=? \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt = new LoggableStatement(conn,strQuery.toString());
				pstmt.setString(1, _syscd);
				pstmt.setString(2, _dsncd);
				pstmt.setString(3, rst.get("rsrcname"));
				////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				rs  = pstmt.executeQuery();
				if (rs.next()){
					rst.put("_itemid", rs.getString("cr_itemid"));
					rst.put("errmsg","정상");
					rst.put("errsw", "0");
				} else {
					rst.put("errmsg","프로그램정보 없음");
					rst.put("errsw", "1");
				}
		        rs.close();
		        pstmt.close();

		        if ( errMsg.length() > 0 ) rst.put("errsw", "1");
		        rsval.add(rst);
				rst = null;
			}
			rs.close();
			pstmt.close();

			conn.commit();
			conn.close();

			rs = null;
			pstmt = null;
			conn = null;


			return rsval.toArray();


		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmm1600.getFileList_excel() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmm1600.getFileList_excel() SQLException END ##");
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
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmm1600.getFileList_excel() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmm1600.getFileList_excel() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rsval != null)	rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)     try{rs2.close();}catch (Exception ex1){ex1.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex3){ex3.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1600.getFileList_excel() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	
	/**  프로그램설명  일괄 업데이트 작업
	 * @param programList : 프로그램 리스트
	 * @param etcData : 기본정보
	 * @return
	 * @throws SQLException
	 * @throws Exception
	 */
	public String program_info_update(ArrayList<HashMap<String,String>> programList,HashMap<String,String> etcData) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();

		try {
			
			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);
			
	        for ( int i=0 ; i<programList.size() ; i++ ){
	        	strQuery.setLength(0);
        		strQuery.append("UPDATE CMR0020 SET CR_STORY=? \n");
        		strQuery.append(" WHERE CR_ITEMID=? \n");
        		pstmt = conn.prepareStatement(strQuery.toString());
        		pstmt.setString(1, programList.get(i).get("story") );
        		pstmt.setString(2, programList.get(i).get("_itemid") );
        		pstmt.executeUpdate();
        		pstmt.close();
	        }
        	conn.commit();
        	conn = null;
			pstmt = null;
			
        	return "";


		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmm1600.request_Check_In() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmm1600.request_Check_In() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmm1600.request_Check_In() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmm1600.request_Check_In() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm1600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	
	
	public String relatUpdt(ArrayList<HashMap<String,String>> chkInList,String UserId) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();

		try {
			
			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);
			ecamsLogger.debug("++++++++++chkInList.size() : "+chkInList.size());

	        for (int i=0;i<chkInList.size();i++)
	        {
	        	strQuery.setLength(0);
	        	strQuery.append("select count(*) cnt from cmd0011 \n");
	        	strQuery.append(" where cd_itemid=?               \n");
	        	strQuery.append("   and cd_prcitem=?              \n");
//	        	pstmt = conn.prepareStatement(strQuery.toString());
	        	pstmt = new LoggableStatement(conn, strQuery.toString());
	        	pstmt.setString(1, chkInList.get(i).get("srcitemid").toString());
	        	pstmt.setString(2, chkInList.get(i).get("moditemid").toString());
	        	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	        	rs = pstmt.executeQuery();
	        	if (rs.next() && rs.getInt("cnt")==0){
	        		rs.close();
	        		pstmt.close();
	        		
	        		strQuery.setLength(0);
	        		strQuery.append("insert into cmd0011      \n");
	        		strQuery.append("  (cd_itemid,cd_prcitem,cd_editor,cd_lastdt) \n");
	        		strQuery.append("values (?,?,?,SYSDATE) \n");
		        	pstmt = conn.prepareStatement(strQuery.toString());
		        	pstmt.setString(1, chkInList.get(i).get("srcitemid").toString());
		        	pstmt.setString(2, chkInList.get(i).get("moditemid").toString());
		        	pstmt.setString(3, UserId);
		        	pstmt.executeUpdate();
		        	pstmt.close();
	        	}
	        	rs.close();
	        	pstmt.close();
	        }
	        
	        conn.commit();
	        conn.close();
        	conn = null;
			pstmt = null;
			rs = null;
			
        	return "OK";

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (conn != null){
				conn.rollback();
			}
			ecamsLogger.error("## Cmm1600.relatUpdt() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmm1600.relatUpdt() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.rollback();
			}
			ecamsLogger.error("## Cmm1600.relatUpdt() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmm1600.relatUpdt() Exception END ##");
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
					ecamsLogger.error("## Cmm1600.relatUpdt() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	
	 public Object[] get_SqlList(String txtSql, String dbGbnCd) throws SQLException, Exception {
			Connection        conn        = null;
			PreparedStatement pstmt       = null;
			ResultSet         rs          = null;
			StringBuffer      strQuery    = new StringBuffer();
			Object[] 		  returnObject= null;
			ArrayList<HashMap<String, String>>  rtList	= new ArrayList<HashMap<String, String>>();
			HashMap<String, String>			  	rst	 	= null;
			ConnectionContext connectionContext = null;

			try {
				if (!"O".equals(dbGbnCd)) {
					
					connectionContext = new ConnectionResource(false,dbGbnCd);
				} else {
					connectionContext = new ConnectionResource();
				}
				conn = connectionContext.getConnection();
				rtList.clear();
				String tmpSql = txtSql.trim();
				String tmpSql1 = "";
				String ERRMSG = "";
				boolean errSw = false;
				boolean readSw = false;
				String[] colName = null;
				int i = 0;
				int j = 0;
				int colcnt = 0;
				tmpSql = tmpSql.trim();
				tmpSql1 = tmpSql.substring(0,tmpSql.indexOf(" "));
				tmpSql1 = tmpSql1.toUpperCase();
				if (tmpSql1.equals("SELECT") || tmpSql1.equals("DESC")) readSw = true;
				else if (tmpSql1.equals("EXEC")) {  //procedure실행
					if (tmpSql.substring(tmpSql.length()-1).equals(";")) tmpSql = "BEGIN " + tmpSql + " end;";
					else tmpSql = "BEGIN " + tmpSql + "; end;";
				}
				
				if (!readSw) {  //update, insert등
					strQuery.setLength(0);
					strQuery.append(tmpSql);
					pstmt = conn.prepareStatement(strQuery.toString());
					pstmt = new LoggableStatement(conn,strQuery.toString());
					ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
		            i = pstmt.executeUpdate();
		            pstmt.close();

		            rst = new HashMap<String, String>();
		            if (i == 0) {
		            	rst.put("ERROR", "Y");
		            	rst.put("ERRMSG", "변경된 Row가 없습니다. 쿼리를 확인하여 주시기 바랍니다.");
		            } else {
		            	rst.put("ERROR", "N");
		            	rst.put("rowcnt", Integer.toString(i));
		            }		            
		            rst.put("readsw", "N");
		            rtList.add(rst);	
		            rst = null;
		            pstmt.close();
		            
				} else {
					tmpSql = tmpSql.replace("from", "FROM");
					tmpSql = tmpSql.replace("select", "SELECT");
					if (tmpSql.indexOf("FROM")< 0) {
						errSw = true;
					}
					if (errSw == false) {
						if (tmpSql.indexOf("SELECT")< 0) {
							errSw = true;
						}
					}
					if (errSw == false) {
						strQuery.setLength(0);
				        strQuery.append(tmpSql);
				        pstmt = conn.prepareStatement(strQuery.toString());
				        pstmt = new LoggableStatement(conn, strQuery.toString());
				        this.ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				        rs = pstmt.executeQuery();
				        while (rs.next())
				        {
				          if (rtList.size() >= 10000)
				          {
				            ERRMSG = ERRMSG + "결과 10000건 이상/";
				            break;
				          }
				          ResultSetMetaData metadata = rs.getMetaData();
				          colcnt = metadata.getColumnCount();
				          if (rs.getRow() == 1)
				          {
				            rst = new HashMap();
				            rst.put("ERROR", "N");
				            rst.put("readsw", "Y");
				            rst.put("header", "Y");
				            for (i = 1; colcnt >= i; i++) {
				              rst.put("col" + Integer.toString(i - 1), metadata.getColumnLabel(i));
				              //ecamsLogger.error( metadata.getColumnLabel(i));
				            }
				            rst.put("colcount", Integer.toString(colcnt));
				            rtList.add(rst);
				            rst = null;
				          }
				          rst = new HashMap();
				          rst.put("ERROR", "N");
				          rst.put("readsw", "Y");
				          rst.put("header", "N");
				          for (i = 1; colcnt >= i; i++) {
				            rst.put("col" + Integer.toString(i - 1), rs.getString(i));
				            //ecamsLogger.error( rs.getString(i));
				          }
				          rst.put("colcount", Integer.toString(colcnt));
				          rtList.add(rst);
				          rst = null;
				        }
				        rs.close();
				        pstmt.close();
				      } else {
						rst = new HashMap<String, String>();
						rst.put("ERROR", "Y");
						rst.put("ERRMSG", "SQL문 확인 요망  "+ERRMSG);
						rtList.add(rst);
						rst = null;
					}
				}
				conn.close();
				rs = null;
		        pstmt = null;
				conn = null;
				//ecamsLogger.error("++++ Query Result ==>"+rtList.toString());
				returnObject = rtList.toArray();
				rtList.clear();
				rtList = null;

				return returnObject;

			} catch (SQLException sqlexception) {
				sqlexception.printStackTrace();
				ecamsLogger.error("## Cmm1600.get_SqlList() SQLException START ##");
				ecamsLogger.error("## Error DESC : ", sqlexception);
				ecamsLogger.error("## Cmm1600.get_SqlList() SQLException END ##");
				throw sqlexception;
			} catch (Exception exception) {
				exception.printStackTrace();
				ecamsLogger.error("## Cmm1600.get_SqlList() Exception START ##");
				ecamsLogger.error("## Error DESC : ", exception);
				ecamsLogger.error("## Cmm1600.get_SqlList() Exception END ##");
				throw exception;
			}finally{
				if (strQuery != null) 	strQuery = null;
				if (returnObject != null)	returnObject = null;
				if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
				if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
				if (conn != null){
					try{
						conn.close();
					}catch(Exception ex3){
						ecamsLogger.error("## Cmm1600.get_SqlList() connection release exception ##");
						ex3.printStackTrace();
					}
				}
			}
		}//end of get_SqlList() method statement
	 	public String execCmd(String cmdText,String UserId,String gbnCd,boolean viewSw) throws SQLException, Exception {
			try {
				Cmr0200 cmr0200 = new Cmr0200();
				int diffRst = 0;
	        	if (gbnCd.equals("A")) {
					diffRst = cmr0200.execShell_ap(UserId+"apcmd.sh",cmdText,viewSw);
					if (diffRst != 0) {
						return "커맨드 수행 중 오류가 발생하였습니다."+ Integer.toString(diffRst);
					}
	        	} else {
	        		diffRst = cmr0200.execShell(UserId+"webcmd.sh",cmdText,viewSw);
					if (diffRst != 0) {
						return "커맨드 수행 중 오류가 발생하였습니다."+ Integer.toString(diffRst);
					}
	        	}
	        	return "0" ;
			} catch (Exception exception) {
				exception.printStackTrace();
				ecamsLogger.error("## Cmm1600.execCmd() Exception START ##");				
				ecamsLogger.error("## Error DESC : ", exception);	
				ecamsLogger.error("## Cmm1600.execCmd() Exception END ##");				
				throw exception;
			}finally{
				
			}
		}
	 	public String getFileView(String saveFile) throws Exception {
			StringBuffer	strQuery    = new StringBuffer();
			File 			shfile		= null;
			String			retMsg 		= "";
			BufferedReader 	in1  		= null;
			String			readline1 	= "";
			try {
				ecamsLogger.error("#### path  ###"+saveFile);
				shfile = new File(saveFile);
				if (!shfile.isFile()) {
					retMsg = "ER파일이 존재하지 않습니다. ["+ saveFile+"]";
					shfile = null;
					return retMsg;
				}
				shfile = null;
				int i = 0;
				String strLine = "";
				in1 = new BufferedReader(new InputStreamReader(new FileInputStream(saveFile),"MS949"));
				strQuery.setLength(0);
				while( (readline1 = in1.readLine()) != null ){
					strQuery.append(readline1+"\n");
				}
				in1.close();
				in1 = null;
				ecamsLogger.error("#### path  ###"+strQuery.toString());
				return "OK"+strQuery.toString();
			} catch (Exception exception) {
				exception.printStackTrace();
				ecamsLogger.error("## Cmm1600.getFileView() Exception START ##");				
				ecamsLogger.error("## Error DESC : ", exception);	
				ecamsLogger.error("## Cmm1600.getFileView() Exception END ##");				
				throw exception;
			}finally{
					
			}
		}
	 	public String getRemoteUrl(String cmdText,String UserId,String gbnCd,String savePath) throws SQLException, Exception {
			try {
				HttpCall httpcall = new HttpCall();
				String retMsg = "";
				HashMap<String,String> etcObj = new HashMap<String,String>();
				etcObj.put("reqMethod", "POST");
				etcObj.put("savePath", savePath);
				if(!"http".equals(cmdText.substring(0,4))) {
					etcObj.put("reqMethod", cmdText.substring(0,cmdText.indexOf(" ")));
					
					if ("GET".equals(etcObj.get("reqMethod")) || "DELETE".equals(etcObj.get("reqMethod")) ) {
						etcObj.put("remoteURL",  cmdText.substring(cmdText.indexOf("http")));
					} else {
						if(cmdText.indexOf("?") > 0) {
							etcObj.put("remoteURL", cmdText.substring(cmdText.indexOf("http"),cmdText.indexOf("?")));
							etcObj.put("sendData", cmdText.substring(cmdText.indexOf("?")+1));
						} else {
							etcObj.put("remoteURL",  cmdText.substring(cmdText.indexOf("http")));
						}
					}
				} else {
					etcObj.put("remoteURL",  cmdText);
				}
				
				retMsg = httpcall.httpCall_common(etcObj);
	        	return retMsg;
			} catch (Exception exception) {
				exception.printStackTrace();
				ecamsLogger.error("## Cmm1600.getRemoteUrl() Exception START ##");				
				ecamsLogger.error("## Error DESC : ", exception);	
				ecamsLogger.error("## Cmm1600.getRemoteUrl() Exception END ##");				
				throw exception;
			}finally{
				
			}
		}
	 	public String fileAttUpdt(String cmdText) throws SQLException, Exception {
			File shfile=null;
			String  shFileName = "";
			String[] strAry = null;
			Runtime  run = null;
			Process p = null;
			
			try {
				ecamsLogger.error("#### path  ###"+cmdText);
				shfile = new File(cmdText);
			
			if( !(shfile.isFile()) ) {
				ecamsLogger.error("#### "+cmdText+"### return : 1");
				return "1";
			}	
			strAry = new String[3];
			strAry[0] = "chmod";
			strAry[1] = "777";
			strAry[2] = cmdText;			
			
			run = Runtime.getRuntime();

			
			p = run.exec(strAry);
			p.waitFor();
			
			run = null;
			p = null;
			strAry = null;
			ecamsLogger.error("#### "+cmdText+"### return : 0");
	        return "0";
			} catch (Exception exception) {
				exception.printStackTrace();
				ecamsLogger.error("## Cmm1600.fileAttUpdt() Exception START ##");				
				ecamsLogger.error("## Error DESC : ", exception);	
				ecamsLogger.error("## Cmm1600.fileAttUpdt() Exception END ##");				
				throw exception;
			}finally{
			}		
		}
}