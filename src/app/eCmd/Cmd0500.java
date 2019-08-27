/*****************************************************************************************
	1. program ID	: eCmd0500.java
	2. create date	: 2008.07. 10
	3. auth		    : no name
	4. update date	: 09.07.16
	5. auth		    :
	6. description	: [프로그램]->[프로그램정보] 화면
*****************************************************************************************/

package app.eCmd;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;

import org.apache.log4j.Logger;
//import app.common.LoggableStatement;
import app.common.LoggableStatement;
import app.common.UserInfo;

import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;


/**
 * @author bigeyes
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */


public class Cmd0500{
    /**
     * Logger Class Instance Creation
     * logger
     */
	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();

    public Object[] getDir_Check(String UserId,String SecuYn,String L_Syscd,
			String L_ItemId,String RsrcCd,String L_DsnCd,String FindFg) throws SQLException, Exception {
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

			strQuery.setLength(0);
			strQuery.append("select a.cm_dirpath,a.cm_dsncd \n");
		    if (!SecuYn.equals("Y")){
		        strQuery.append("from cmm0070 a,cmm0073 b,cmm0072 c,cmm0044 d,cmr0020 e \n");
		        strQuery.append("where e.cr_itemid=?                                    \n");
		        strQuery.append("  and e.cr_syscd=d.cm_syscd and e.cr_jobcd=d.cm_jobcd  \n");
		        strQuery.append("  and d.cm_userid=?                                    \n");
		        strQuery.append("  and d.cm_syscd=b.cm_syscd and d.cm_jobcd=b.cm_jobcd  \n");
		    } else{
		        strQuery.append(" from cmm0070 a,cmm0073 b,cmm0072 c,cmr0020 e          \n");
		        strQuery.append("where e.cr_itemid=?                                    \n");
		        strQuery.append("  and e.cr_syscd=b.cm_syscd and e.cr_jobcd=b.cm_jobcd  \n");
		    }
	        strQuery.append("and a.cm_syscd=b.cm_syscd and a.cm_dsncd=b.cm_dsncd        \n");
	        strQuery.append("and a.cm_syscd=c.cm_syscd and a.cm_dsncd=c.cm_dsncd        \n");
	        strQuery.append("and c.cm_rsrccd=?                                          \n");

	        pstmt = conn.prepareStatement(strQuery.toString());
	        pstmt =  new LoggableStatement(conn, strQuery.toString());
	        int CNT = 0;
	        pstmt.setString(++CNT, L_ItemId);
		    if (!SecuYn.equals("Y")){
		    	pstmt.setString(++CNT, UserId);
		    }
			pstmt.setString(++CNT, RsrcCd);
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	        rs = pstmt.executeQuery();
			while (rs.next()){
				if (L_DsnCd != "" && FindFg.equals("false")){
					if (L_DsnCd.equals(rs.getString("cm_dsncd"))) FindFg = "true";
				}
				rst = new HashMap<String, String>();
				rst.put("ID", "Cbo_Dir");
				rst.put("cm_dsncd", rs.getString("cm_dsncd"));
				rst.put("cm_dirpath", rs.getString("cm_dirpath"));
	           	rsval.add(rst);
	           	rst = null;
			}
			rs.close();
			pstmt.close();

			if (FindFg.equals("false")){
				strQuery.setLength(0);
	    	   	strQuery.append("select cm_dirpath from cmm0070 where \n");
	    	   	strQuery.append(" cm_syscd=? and \n");	//L_Syscd
	    	   	strQuery.append(" cm_dsncd=? \n");	//L_DsnCd
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, L_Syscd);
				pstmt.setString(2, L_DsnCd);
				rs = pstmt.executeQuery();
				if (rs.next()){
					rst = new HashMap<String, String>();
					rst.put("ID", "Cbo_Dir");
					rst.put("cm_dsncd", L_DsnCd);
					rst.put("cm_dirpath", rs.getString("cm_dirpath"));
		           	rsval.add(rst);
		           	rst = null;
				}
				rs.close();
				pstmt.close();

			}
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;

			rtObj = rsval.toArray();
			rsval.clear();
			rsval = null;

			return rtObj;

		} catch (SQLException sqlexception) {
			if (conn != null){
				conn.close();conn = null;
			}
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.close();conn = null;
			}
			exception.printStackTrace();
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rtObj != null)	rtObj = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
	}//end of getCbo_Set() method statement


    //검색창에 공백 제거
    public static String allTrim(String s)
    {
        if (s == null)
            return null;
        else if (s.length() == 0)
            return "";

        int len = s.length();
        int i = 0;
        int j = len;

        for (i = 0; i < len; i++) {
            if ( s.charAt(i) != ' ' && s.charAt(i) != 't' && s.charAt(i) != 'r' && s.charAt(i) != 'n' )
                break;
        }
        if (i == len)
            return "";

        for (j = len - 1; j >= i; j--) {
            if ( s.charAt(i) != ' ' && s.charAt(i) != 't' && s.charAt(i) != 'r' && s.charAt(i) != 'n' )
                break;
        }
        return s.substring(i, j + 1);
    }


	//public Object[] getSql_Qry(String UserId,String SecuYn,String ViewFg, String L_Syscd,String Txt_ProgId,String DsnCd,String Rsrccd, String DirPath)
	public Object[] getSql_Qry(HashMap<String, String> etcData)
    	throws SQLException, Exception {		
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rtList = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst    = null;
		Object[]		  rtObj		  = null;

		ConnectionContext connectionContext = new ConnectionResource();
		try {
			conn = connectionContext.getConnection();
			boolean adminSw = false;
			if ("X".equals(etcData.get("SecuYn"))) {
				UserInfo userinfo = new UserInfo();
				adminSw = userinfo.isAdmin_conn(etcData.get("UserId"),conn);
				userinfo = null;
			} else {
				if ("Y".equals(etcData.get("SecuYn"))) adminSw = true;
			}
			String			  inProgName = "";
			if (etcData.get("Txt_ProgId") != null && !"".equals(etcData.get("Txt_ProgId"))) {
				inProgName = etcData.get("Txt_ProgId");
				allTrim(inProgName);
			}
			strQuery.setLength(0);
			strQuery.append("select a.cr_syscd,a.cr_dsncd,a.cr_rsrcname,a.cr_jobcd,   \n");
			strQuery.append("       a.cr_itemid,a.cr_lstver,b.cm_dirpath,a.cr_status, \n");
			strQuery.append("       a.cr_viewver,a.cr_rsrccd,g.cm_info,c.cm_sysmsg,   \n");
			strQuery.append("       c.cm_sysinfo,a.cr_isrid,                          \n");
			strQuery.append("       (select cm_jobname from cmm0102                   \n");
			strQuery.append("          where cm_jobcd=a.cr_jobcd) cm_jobname,         \n");
			strQuery.append("       (select cm_codename from cmm0020                  \n");
			strQuery.append("          where cm_macode='JAWON'                        \n");
			strQuery.append("            and cm_micode=a.cr_rsrccd) JAWON,            \n");
			strQuery.append("       (select cm_codename from cmm0020                  \n");
			strQuery.append("          where cm_macode='CMR0020'                      \n");
			strQuery.append("            and cm_micode=a.cr_status) CMR0020,          \n");
			strQuery.append("       (select cm_username from cmm0040                  \n");
			strQuery.append("          where cm_userid=a.cr_owner) owner,    	      \n");
			strQuery.append("       (select cc_reqtitle from cmc0100                  \n");
			strQuery.append("          where cc_srid=a.cr_isrid) srtitle    	      \n");
	        strQuery.append("  from cmm0030 c,cmr0020 a,cmm0070 b,cmm0036 g           \n");
	        if (etcData.get("itemid") != null && !"".equals(etcData.get("itemid"))) {
	        	strQuery.append(" where a.cr_itemid=?                                 \n");	 
	        } else {
	        	strQuery.append(" where a.cr_syscd=?                                  \n");
		        if ("Y".equals(etcData.get("SecuYn")) && "false".equals(etcData.get("ViewFg"))) {
		        	strQuery.append("   and exists (select 1 from cmm0044                 \n");
		        	strQuery.append("                where cm_userid=?                    \n");
		        	strQuery.append("                  and cm_syscd=a.cr_syscd            \n");
		        	strQuery.append("                  and cm_jobcd=a.cr_jobcd            \n");
		        	strQuery.append("                  and cm_closedt is null)            \n");
		        }
		        if (inProgName.length()>0) {
			        strQuery.append("   and upper(a.cr_rsrcname) like upper(?)            \n");	// %Txt_ProgId%
		        }
		        if (etcData.get("Rsrccd") != null && !"".equals(etcData.get("Rsrccd"))) {
		        	strQuery.append("   and a.cr_rsrccd=?                                 \n");
		        }
		        if (etcData.get("DirPath") != null && !"".equals(etcData.get("DirPath"))) {
		        	strQuery.append("   and upper(b.cm_dirpath) like upper(?)		      \n");
		        }
		        if(etcData.get("JobCd") != null && !"".equals(etcData.get("JobCd"))) {
		        	strQuery.append("  and a.cr_rsrccd=? 							      \n");
		        }	
	        }	        	 
	        strQuery.append("   and a.cr_syscd=c.cm_syscd                             \n");	
		    strQuery.append("   and a.cr_syscd=b.cm_syscd and a.cr_dsncd=b.cm_dsncd   \n");
		    strQuery.append("   and a.cr_syscd=g.cm_syscd and a.cr_rsrccd=g.cm_rsrccd \n");

		    //pstmt = conn.prepareStatement(strQuery.toString());
	        pstmt =  new LoggableStatement(conn, strQuery.toString());
	        int CNT = 0;
	        if (etcData.get("itemid") != null && !"".equals(etcData.get("itemid"))) {
	        	pstmt.setString(++CNT, etcData.get("itemid"));
	        } else {
			    pstmt.setString(++CNT, etcData.get("L_Syscd"));
			    if ("Y".equals(etcData.get("SecuYn")) && "false".equals(etcData.get("ViewFg"))) {
			    	pstmt.setString(++CNT, etcData.get("UserId"));
			    }
			    if (inProgName.length()>0) pstmt.setString(++CNT, "%"+inProgName+"%");
			    if (etcData.get("Rsrccd") != null && !"".equals(etcData.get("Rsrccd"))) pstmt.setString(++CNT, etcData.get("Rsrccd"));
			    if (etcData.get("DirPath") != null && !"".equals(etcData.get("DirPath"))) pstmt.setString(++CNT, "%"+etcData.get("DirPath")+"%");
			    if(etcData.get("JobCd") != null && !"".equals(etcData.get("JobCd"))) pstmt.setString(++CNT, etcData.get("JobCd"));
	        }
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            rs = pstmt.executeQuery();

            rtList.clear();
			while (rs.next()){
				if ("1".equals(rs.getString("cm_info").substring(25, 26))) continue; //자동생성항목 프로그램인 경우 제외

				rst = new HashMap<String,String>();
				rst.put("cm_sysmsg",rs.getString("cm_sysmsg"));
				rst.put("cm_jobname",rs.getString("cm_jobname"));
				rst.put("cm_dirpath",rs.getString("cm_dirpath"));
				rst.put("cm_codename",rs.getString("JAWON"));
				rst.put("cr_rsrcname",rs.getString("cr_rsrcname"));
				rst.put("cr_lstver",rs.getString("cr_lstver"));
				rst.put("cr_viewver",rs.getString("cr_viewver"));
				rst.put("sta",rs.getString("CMR0020"));
				rst.put("cr_dsncd",rs.getString("cr_dsncd"));
				rst.put("cr_syscd",rs.getString("cr_syscd"));
				rst.put("cr_jobcd",rs.getString("cr_jobcd"));
				rst.put("cr_itemid",rs.getString("cr_itemid"));
				rst.put("baseitem",rs.getString("cr_itemid"));
				rst.put("cm_info", rs.getString("cm_info"));
				rst.put("cr_status", rs.getString("cr_status"));
				rst.put("cm_sysinfo", rs.getString("cm_sysinfo"));
				rst.put("subset", "N");
				rst.put("base","0");
				if (adminSw) rst.put("adminsw", "Y");
				else rst.put("adminsw", "N");
				rst.put("owner", rs.getString("owner"));
				rst.put("srid", rs.getString("cr_isrid"));
				if(rs.getString("cr_isrid") != null && !"".equals(rs.getString("cr_isrid"))) {
					rst.put("sr", "["+rs.getString("cr_isrid")+"]"+rs.getString("srtitle"));
				}else rst.put("sr", "");
				
				rtList.add(rst);
				rst = null;
			}//end of while-loop statement
			rs.close();
			pstmt.close();
			
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;

			rtObj = rtList.toArray();
			rtList.clear();
			rtList = null;

			return rtObj;

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmd0500.getSql_Qry() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## SysInfo.getSql_Qry() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## SysInfo.getSql_Qry() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## SysInfo.getSql_Qry() Exception END ##");
			throw exception;
		}finally{
			if (rtObj != null)	rtObj = null;
			if (strQuery != null)	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
	}//end of getSql_Qry() method statement
	public String getProgInfo(String ItemId) throws SQLException, Exception {

		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		String            strMsg      = "";
		ConnectionContext connectionContext = new ConnectionResource();
		try {
			conn = connectionContext.getConnection();

			strQuery.setLength(0);
			strQuery.append("select cr_syscd,cr_rsrcname,cr_dsncd from cmr0020     \n");
		    strQuery.append(" where cr_itemid=?                                    \n");

	        //pstmt =  new LoggableStatement(conn, strQuery.toString());
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, ItemId);
	        //ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            rs = pstmt.executeQuery();
			if (rs.next()){
				strMsg = rs.getString("cr_syscd");
				strMsg = strMsg+rs.getString("cr_dsncd");
				strMsg = strMsg+rs.getString("cr_rsrcname");
			}//end of while-loop statement
			rs.close();
			pstmt.close();
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;

			return strMsg;

		} catch (SQLException sqlexception) {
			if (conn != null){
				conn.close();conn = null;
			}
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.close();conn = null;
			}
			exception.printStackTrace();
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
	}//end of getSql_Qry() method statement

    //public Object[] Cmd0500_Lv_File_ItemClick(String UserId,String SecuYn,String L_SysCd,String L_JobCd,String L_ItemId)	throws SQLException, Exception {
    public Object[] Cmd0500_Lv_File_ItemClick(HashMap<String, String> etcData)	throws SQLException, Exception {

		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2       = null;
		ResultSet         rs          = null;
		ResultSet         rs2          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rtList = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		Object[]		  rtObj		  = null;

		ConnectionContext connectionContext = new ConnectionResource();
		try {
			conn = connectionContext.getConnection();
			boolean adminSw = false;
			if ("X".equals(etcData.get("SecuYn"))) {
				UserInfo userinfo = new UserInfo();
				adminSw = userinfo.isAdmin_conn(etcData.get("UserId"),conn);
				userinfo = null;
			} else {
				if ("Y".equals(etcData.get("SecuYn"))) adminSw = true;
			}
    		strQuery.setLength(0);
    		strQuery.append("select a.cr_rsrcname,a.cr_story,a.cr_editor,a.cr_isrid,	     \n");
    		strQuery.append("       to_char(a.cr_opendate,'yyyy/mm/dd hh24:mi') cr_opendate, \n");
    		strQuery.append("       to_char(a.cr_lstdat,'yyyy/mm/dd hh24:mi') cr_lastdate,   \n");
    		strQuery.append("       a.cr_jobcd,a.cr_creator,a.cr_status,a.cr_lstver,         \n");
    		strQuery.append("       a.cr_rsrccd,a.cr_lstusr,b.cm_info,a.cr_syscd,a.cr_itemid,\n");
    		strQuery.append("       a.cr_dsncd,                                              \n");
    		strQuery.append("       a.cr_ckinacpt,a.cr_devacpt,a.cr_testacpt,a.cr_realacpt,  \n");
    		strQuery.append("       (select cm_sysmsg from cmm0030                           \n");
    		strQuery.append("         where cm_syscd=a.cr_syscd) cm_sysmsg,                  \n");
    		strQuery.append("       (select cm_username from cmm0040                         \n");
    		strQuery.append("         where cm_userid=a.cr_creator) creator,                 \n");
    		strQuery.append("       (select cm_username from cmm0040                         \n");
    		strQuery.append("         where cm_userid=a.cr_editor) editor,                   \n");
    		strQuery.append("       (select cm_codename from cmm0020                         \n");
    		strQuery.append("         where cm_macode='JAWON'                                \n");
    		strQuery.append("           and cm_micode=a.cr_rsrccd) cm_codename,              \n");
    		strQuery.append("       (select cm_dirpath from cmm0070                          \n");
    		strQuery.append("         where cm_syscd=a.cr_syscd                              \n");
    		strQuery.append("           and cm_dsncd=a.cr_dsncd) cm_dirpath,                 \n");
			strQuery.append("       (select cm_codename from cmm0020                         \n");
			strQuery.append("          where cm_macode='CMR0020'                             \n");
			strQuery.append("            and cm_micode=a.cr_status) CMR0020,                 \n");
    		strQuery.append("       (select count(*) from cmm0044                            \n");
    		strQuery.append("         where cm_syscd=a.cr_syscd                              \n");
    		strQuery.append("           and cm_jobcd=a.cr_jobcd                              \n");
    		strQuery.append("           and cm_userid=?                                      \n");
    		strQuery.append("           and cm_closedt is null) progsecu                     \n");
    		strQuery.append("  from cmm0036 b,cmr0020 a                                      \n");
    		strQuery.append(" where a.cr_itemid=?                                            \n");
    		strQuery.append("   and a.cr_syscd=b.cm_syscd and a.cr_rsrccd=b.cm_rsrccd        \n");

		    //pstmt = conn.prepareStatement(strQuery.toString());
		    pstmt =  new LoggableStatement(conn, strQuery.toString());
	    	pstmt.setString(1, etcData.get("UserId"));
	    	pstmt.setString(2, etcData.get("L_ItemId"));
	    	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	    	rs = pstmt.executeQuery();

	    	if (rs.next()) {
				rst = new HashMap<String,String>();
				rst.put("Lbl_LstUsrCkIn", "");
				rst.put("Lbl_LstDatCkIn", "");
				rst.put("Lbl_LstUsrDev", "");
				rst.put("Lbl_LstDatDev", "");
				rst.put("Lbl_LstUsrTest", "");
				rst.put("Lbl_LstDatTest", "");
				rst.put("Lbl_LstUsrReal", "");
				rst.put("Lbl_LstDatReal", "");
				rst.put("cr_isrid", "");
				rst.put("Lbl_Creator","");
				rst.put("Lbl_Editor","");
				rst.put("cm_sysmsg","");

				rst.put("cm_sysmsg",rs.getString("cm_sysmsg"));
				rst.put("Lbl_ProgName",rs.getString("cr_story"));
				rst.put("Lbl_CreatDt",rs.getString("cr_opendate"));
				rst.put("Lbl_LastDt",rs.getString("cr_lastdate"));
				rst.put("WkJobCd",rs.getString("cr_jobcd"));
				rst.put("WkSta",rs.getString("cr_status"));
				rst.put("cm_info",rs.getString("cm_info"));
				rst.put("WkVer",Integer.toString(rs.getInt("cr_lstver")));
				rst.put("WkRsrcCd",rs.getString("cr_rsrccd"));
				rst.put("cr_editor",rs.getString("cr_editor"));
				rst.put("RsrcName", rs.getString("cm_codename"));
				rst.put("cr_rsrcname", rs.getString("cr_rsrcname"));
				rst.put("cm_dirpath", rs.getString("cm_dirpath"));
				rst.put("cr_itemid", rs.getString("cr_itemid"));
				rst.put("cr_syscd", rs.getString("cr_syscd"));
				rst.put("cr_dsncd", rs.getString("cr_dsncd"));
				rst.put("cr_isrid", rs.getString("cr_isrid"));
				rst.put("sta", rs.getString("CMR0020"));
				rst.put("WkSecu","false");
				if (adminSw || etcData.get("UserId").equals(rs.getString("cr_editor")) || 
					rs.getInt("progsecu")>0) {
					rst.put("WkSecu","true");
				}
				if (rs.getString("cr_creator") != null){
					rst.put("Lbl_Creator",rs.getString("creator"));
				}
				if (rs.getString("cr_editor") != null){
					rst.put("Lbl_Editor",rs.getString("editor"));
		        }
				if (adminSw) rst.put("adminsw", "Y");
				else rst.put("adminsw", "N");
				
				if (rs.getString("cr_ckinacpt") != null){
	        	   	strQuery.setLength(0);
	        	   	strQuery.append("select to_char(a.cr_prcdate,'yyyy/mm/dd hh24:mi') prcdate, \n");
	        	   	strQuery.append("       b.cm_username                                       \n");
	        	   	strQuery.append("  from cmm0040 b,cmr0021 a                                 \n");
	        	   	strQuery.append(" where a.cr_acptno=? and a.cr_itemid=?                     \n");
	        	   	strQuery.append("   and a.cr_editor=b.cm_userid                             \n");
	        	   	pstmt2 = conn.prepareStatement(strQuery.toString());
	        	   	pstmt2.setString(1, rs.getString("cr_ckinacpt"));
	        	   	pstmt2.setString(2, etcData.get("L_ItemId"));
					rs2 = pstmt2.executeQuery();
					if (rs2.next()) {
						rst.put("Lbl_LstUsrCkIn",rs2.getString("cm_username"));
						rst.put("Lbl_LstDatCkIn",rs2.getString("prcdate"));
					}
					rs2.close();
					pstmt2.close();
				}
				if (rs.getString("cr_devacpt") != null){
	        	   	strQuery.setLength(0);
	        	   	strQuery.append("select to_char(a.cr_prcdate,'yyyy/mm/dd hh24:mi') prcdate, \n");
	        	   	strQuery.append("       b.cm_username                                       \n");
	        	   	strQuery.append("  from cmm0040 b,cmr0021 a                                 \n");
	        	   	strQuery.append(" where a.cr_acptno=? and a.cr_itemid=?                     \n");
	        	   	strQuery.append("   and a.cr_editor=b.cm_userid                             \n");
	        	   	pstmt2 = conn.prepareStatement(strQuery.toString());
	        	   	pstmt2.setString(1, rs.getString("cr_devacpt"));
	        	   	pstmt2.setString(2, etcData.get("L_ItemId"));
					rs2 = pstmt2.executeQuery();
					if (rs2.next()) {
						rst.put("Lbl_LstUsrDev",rs2.getString("cm_username"));
						rst.put("Lbl_LstDatDev",rs2.getString("prcdate"));
					}
					rs2.close();
					pstmt2.close();
				}
				if (rs.getString("cr_testacpt") != null){
	        	   	strQuery.setLength(0);
	        	   	strQuery.append("select to_char(a.cr_prcdate,'yyyy/mm/dd hh24:mi') prcdate, \n");
	        	   	strQuery.append("       b.cm_username                                       \n");
	        	   	strQuery.append("  from cmm0040 b,cmr0021 a                                 \n");
	        	   	strQuery.append(" where a.cr_acptno=? and a.cr_itemid=?                     \n");
	        	   	strQuery.append("   and a.cr_editor=b.cm_userid                             \n");
	        	   	pstmt2 = conn.prepareStatement(strQuery.toString());
	        	   	pstmt2.setString(1, rs.getString("cr_testacpt"));
	        	   	pstmt2.setString(2, etcData.get("L_ItemId"));
					rs2 = pstmt2.executeQuery();
					if (rs2.next()) {
						rst.put("Lbl_LstUsrTest",rs2.getString("cm_username"));
						rst.put("Lbl_LstDatTest",rs2.getString("prcdate"));
					}
					rs2.close();
					pstmt2.close();
				}
				if (rs.getString("cr_realacpt") != null){
	        	   	strQuery.setLength(0);
	        	   	strQuery.append("select to_char(a.cr_prcdate,'yyyy/mm/dd hh24:mi') prcdate, \n");
	        	   	strQuery.append("       b.cm_username                                       \n");
	        	   	strQuery.append("  from cmm0040 b,cmr0021 a                                 \n");
	        	   	strQuery.append(" where a.cr_acptno=? and a.cr_itemid=?                     \n");
	        	   	strQuery.append("   and a.cr_editor=b.cm_userid                             \n");
	        	   	pstmt2 = conn.prepareStatement(strQuery.toString());
	        	   	pstmt2.setString(1, rs.getString("cr_realacpt"));
	        	   	pstmt2.setString(2, etcData.get("L_ItemId"));
					rs2 = pstmt2.executeQuery();
					if (rs2.next()) {
						rst.put("Lbl_LstUsrReal",rs2.getString("cm_username"));
						rst.put("Lbl_LstDatReal",rs2.getString("prcdate"));
					}
					rs2.close();
					pstmt2.close();
				}

	    		rtList.add(rst);
	    		rst = null;
		    }else{
				rst = new HashMap<String,String>();
				rst.put("ID","Sql_Qry_Prog2");
		    	rst.put("WkSecu","false");
		    	rtList.add(rst);
		    	rst = null;
		    }
	    	pstmt2 = null;

	    	rs.close();
	    	pstmt.close();
	    	conn.close();
			rs = null;
			pstmt = null;
			conn = null;

			rtObj = rtList.toArray();
			rtList.clear();
			rtList = null;

			return rtObj;

		} catch (SQLException sqlexception) {
			if (conn != null){
				conn.close();conn = null;
			}
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.close();conn = null;
			}
			exception.printStackTrace();
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rtObj != null)	rtObj = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
    }//end of getGrid1_Click() method statement

    //public Object[] getSql_Qry_Hist(String UserId,String L_SysCd,String L_JobCd,String Cbo_ReqCd, String L_ItemId)	throws SQLException, Exception {
    public Object[] getSql_Qry_Hist(HashMap<String, String> etcData)	throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2       = null;
		ResultSet         rs          = null;
		ResultSet         rs2      = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rtList = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;

		ConnectionContext connectionContext = new ConnectionResource();
		try {
			conn = connectionContext.getConnection();

		    strQuery.setLength(0);
	    	strQuery.append("select a.cr_acptno,a.cr_aplydate,a.cr_status,      \n");
	    	strQuery.append("       a.cr_rsrccd,d.cr_qrycd,d.cr_prcdate,        \n");
	    	strQuery.append("       d.cr_sayu,d.cr_passok,d.cr_passcd,          \n");
	    	strQuery.append("       a.cr_befviewver,a.cr_aftviewver,            \n");
	    	strQuery.append("       to_char(d.cr_acptdate,'yyyy-mm-dd hh24:mi:ss') acptdate, \n");
	    	strQuery.append("       to_char(a.cr_prcdate,'yyyy-mm-dd hh24:mi:ss') prcdate,   \n");
	    	strQuery.append("       d.cr_itsmtitle,d.cr_itsmid,                  \n");
	    	strQuery.append("      (select cm_codename from cmm0020              \n");
	    	strQuery.append("        where cm_macode='REQUEST'                   \n");
	    	strQuery.append("          and cm_micode=d.cr_qrycd) REQUEST,        \n");
	    	strQuery.append("      (select cm_codename from cmm0020              \n");
	    	strQuery.append("        where cm_macode='REQPASS'                   \n");
	    	strQuery.append("          and cm_micode=d.cr_passok) REQPASS,       \n");
	    	strQuery.append("      (select cm_username from cmm0040              \n");
	    	strQuery.append("        where cm_userid=d.cr_editor) cm_username    \n");
	    	strQuery.append(" from cmr1010 a,cmr1000 d                           \n");
	    	strQuery.append(" where a.cr_itemid=?                                \n"); //L_ItemId
	    	strQuery.append("   and a.cr_acptno=d.cr_acptno                      \n"); 
            if (!"ALL".equals(etcData.get("Cbo_ReqCd"))){
            	strQuery.append("   and d.cr_qrycd=?                             \n"); //Cbo_ReqCd
            }
            strQuery.append(" order by cr_prcdate desc \n");

		    //pstmt = conn.prepareStatement(strQuery.toString());
		    pstmt =  new LoggableStatement(conn, strQuery.toString());
		    int CNT = 0;
	    	pstmt.setString(++CNT, etcData.get("L_ItemId"));
	    	if (!"ALL".equals(etcData.get("Cbo_ReqCd"))) pstmt.setString(++CNT, etcData.get("Cbo_ReqCd"));
	    	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	    	rs = pstmt.executeQuery();
		    while (rs.next()){
				rst = new HashMap<String,String>();
				rst.put("acptdate",rs.getString("acptdate"));//rs.getString("cr_acptdate").substring(0,rs.getString("cr_acptdate").length()-2)
				rst.put("cm_username",rs.getString("cm_username"));

				rst.put("REQUEST",rs.getString("REQUEST"));
                rst.put("cr_qrycd", rs.getString("cr_qrycd"));
                rst.put("cr_befviewver", rs.getString("cr_befviewver"));
                rst.put("cr_aftviewver", rs.getString("cr_aftviewver"));
                rst.put("acptno",rs.getString("cr_acptno").substring(0,4)+"-"+
                		rs.getString("cr_acptno").substring(4,6)+"-"+
                		rs.getString("cr_acptno").substring(6));
                rst.put("cr_acptno",rs.getString("cr_acptno"));

                if (!rs.getString("cr_qrycd").equals("04")){
	                rst.put("passok","");
                }else{
			    	rst.put("passok",rs.getString("REQPASS"));

					if ("4".equals(rs.getString("cr_passok")) && rs.getString("cr_aplydate") != null){
	                    rst.put("passok","적용일시적용["+rs.getString("cr_aplydate").substring(0,4)
	                    			+"/"+rs.getString("cr_aplydate").substring(4,6)+"/"+rs.getString("cr_aplydate").substring(6,8)
	                    			+" "+rs.getString("cr_aplydate").substring(8,10)+":"+rs.getString("cr_aplydate").substring(10,12)+"]");
					}
                }

                if (rs.getString("cr_prcdate") != null){
                	if (rs.getString("cr_status").equals("3"))
	                	   rst.put("prcdate", "[반송]" + rs.getString("prcdate"));//rs.getString("cr_prcdate").substring(5,rs.getString("cr_prcdate").length()-2)
                	else
                	   rst.put("prcdate", rs.getString("prcdate"));
                } else {
                	rst.put("prcdate","진행중");
                }
                if ( rs.getString("cr_sayu") !=null ){
                	rst.put("cr_sayu", rs.getString("cr_sayu"));//신청사유
                } else {
                	rst.put("cr_sayu", "");//신청사유
                }
                
                if ( rs.getString("cr_itsmid") != null ) {
                	rst.put("srinfo", "[" + rs.getString("cr_itsmid") + "]" + rs.getString("cr_itsmtitle") );
                } else {
                	rst.put("srinfo", "" );
                }
                rst.put("cr_status", rs.getString("cr_status"));
                rtList.add(rst);
                rst = null;
		    }
		    rs.close();
		    pstmt.close();
		    conn.close();
		    rs = null;
		    pstmt = null;
		    conn = null;

			return rtList.toArray();

		} catch (SQLException sqlexception) {
			if (conn != null){
				conn.close();conn = null;
			}
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.close();conn = null;
			}
			exception.printStackTrace();
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rtList != null)	rtList = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
    }//end of getSql_Qry_Hist() method statement


    /*public int getTbl_Update(String L_ItemId,String L_JobCd,String L_RsrcCd,
    		String Txt_ProgName,String Cbo_Dir_Code,
    		String Cbo_Editor,String SvRsrc,String svDsnCd, String srid) throws SQLException, Exception {*/
    public int getTbl_Update(HashMap<String, String> etcData) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		int				  rtn_cnt     = 0;
		int               parmCnt     = 0;

		ConnectionContext connectionContext = new ConnectionResource();

		try {

			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);

			//String      strJob[] = L_JobCd.split(",");
			strQuery.setLength(0);
			strQuery.append("update cmr0020                 \n");//L_JobCd
			strQuery.append("   set cr_editor=?             \n");
			strQuery.append("      ,cr_lastdate=SYSDATE     \n");
		    if (etcData.get("editor").length() > 0) {
		    	strQuery.append("  ,cr_editor=?             \n");//Cbo_Editor
		    }
		    if (etcData.get("srid").length() > 0) {
		    	strQuery.append("  ,cr_isrid=?              \n");//cboSr
		    }
		    if (etcData.get("jobcd").length() > 0) {
		    	strQuery.append("  ,cr_jobcd=?              \n");//jobcd
		    }
		    if (etcData.get("rsrccd").length() > 0) {
		    	strQuery.append("  ,cr_rsrccd=?             \n");//rsrccd
		    }
		    if (etcData.get("dsncd").length() > 0) {
		    	strQuery.append("  ,cr_dsncd=?              \n");//dsncd
		    }
		    if (etcData.get("story").length() > 0) {
		    	strQuery.append("  ,cr_story=?              \n");//story
		    }
		    strQuery.append(" where cr_itemid=?             \n");//L_ItemId
			pstmt = conn.prepareStatement(strQuery.toString());
			parmCnt = 0;

            pstmt.setString(++parmCnt, etcData.get("userid"));
			if (etcData.get("editor").length() > 0) pstmt.setString(++parmCnt, etcData.get("editor"));
			if (etcData.get("srid").length() > 0) pstmt.setString(++parmCnt, etcData.get("srid"));
			if (etcData.get("jobcd").length() > 0) pstmt.setString(++parmCnt, etcData.get("jobcd"));
			if (etcData.get("rsrccd").length() > 0) pstmt.setString(++parmCnt, etcData.get("rsrccd"));
			if (etcData.get("dsncd").length() > 0) pstmt.setString(++parmCnt, etcData.get("dsncd"));
			if (etcData.get("story").length() > 0) pstmt.setString(++parmCnt, etcData.get("story"));
            pstmt.setString(++parmCnt, etcData.get("itemId"));
            rtn_cnt = pstmt.executeUpdate();
            pstmt.close();

            if (etcData.get("dsncd").length() > 0) {
		    	strQuery.setLength(0);
		    	strQuery.append("update cmr1010 set cr_dsncd=? \n");//Cbo_Dir_code
		    	strQuery.append(" where cr_itemid=?            \n");//L_ItemId
				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt =  new LoggableStatement(conn, strQuery.toString());
	            pstmt.setString(1, etcData.get("dsncd"));
	            pstmt.setString(2, etcData.get("itemid"));
	            //ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	            rtn_cnt = pstmt.executeUpdate();
	            pstmt.close();
            }

            conn.commit();
            conn.close();
		    pstmt = null;
		    conn = null;

            return rtn_cnt;

		} catch (SQLException sqlexception) {
			if (conn != null){
				conn.rollback();
				conn.close();conn = null;
			}
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmd0500.getTbl_Update() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0Cmd0500200.getTbl_Update() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.rollback();
				conn.close();conn = null;
			}
			exception.printStackTrace();
			ecamsLogger.error("## Cmd0500.getTbl_Update() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmd0500.getTbl_Update() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmd0500.getTbl_Update() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
    }//end of getTbl_Update() method statement

    public int getItem_Delete(String UserId,String L_ItemId) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();
			
			Cmd0100 cmd0100 = new Cmd0100();
			
			strQuery.setLength(0);
			strQuery.append("select a.cr_itemid,a.cr_baseitem,b.cr_status \n");
			strQuery.append("  from cmr0022 a,cmr0020 b                   \n");
			strQuery.append(" where a.cr_baseitem=?                       \n");
			strQuery.append("   and a.cr_itemid=b.cr_itemid               \n");
			strQuery.append("   and not exists (select 1 from cmr0022     \n");
			strQuery.append("                    where cr_itemid=b.cr_itemid \n");
			strQuery.append("                      and cr_baseitem<>a.cr_baseitem) \n");
			strQuery.append("   and not exists (select 1 from cmr1010     \n");
			strQuery.append("                    where cr_itemid=b.cr_itemid \n");
			strQuery.append("                      and cr_prcdate is null) \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, L_ItemId);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				cmd0100.cmr0020_Delete_sub(UserId, rs.getString("cr_itemid"), conn);
			}
			rs.close();
			pstmt.close();

			cmd0100.cmr0020_Delete_sub(UserId, L_ItemId, conn);
			
			cmd0100 = null;
			
            conn.commit();
            conn.close();
		    pstmt = null;
		    conn = null;

            return 1;

		} catch (SQLException sqlexception) {
			if (conn != null){
				conn.close();conn = null;
			}
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.close();conn = null;
			}
			exception.printStackTrace();
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
    }//end of getItem_delete() method statement

    public int getTbl_Delete(String UserId,String L_ItemId) throws SQLException, Exception {
		Connection        conn        = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2      = null;
		StringBuffer      strQuery    = new StringBuffer();
		int				  rtn_cnt     = 0;

		ConnectionContext connectionContext = new ConnectionResource();
		try {
			conn = connectionContext.getConnection();	
			
			strQuery.setLength(0);
			strQuery.append("select a.cr_itemid,a.cr_baseitem,b.cr_status \n");
			strQuery.append("  from cmr0022 a,cmr0020 b                   \n");
			strQuery.append(" where a.cr_baseitem=?                       \n");
			strQuery.append("   and a.cr_itemid=b.cr_itemid               \n");
			strQuery.append("   and not exists (select 1 from cmr0022     \n");
			strQuery.append("                    where cr_itemid=b.cr_itemid \n");
			strQuery.append("                      and cr_baseitem<>a.cr_baseitem) \n");
			strQuery.append("   and not exists (select 1 from cmr1010     \n");
			strQuery.append("                    where cr_itemid=b.cr_itemid \n");
			strQuery.append("                      and cr_prcdate is null) \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, L_ItemId);
			rs = pstmt.executeQuery();
			while (rs.next()) {
				strQuery.setLength(0);
		    	strQuery.append("update cmr0020 set cr_status='9', cr_clsdate=SYSDATE	\n");
		    	strQuery.append(" where cr_itemid=?										\n");
		    	pstmt2 = conn.prepareStatement(strQuery.toString());
	            pstmt2.setString(1, rs.getString("cr_itemid"));
	            pstmt2.executeUpdate();
			}
			rs.close();
			pstmt.close();
			
			strQuery.setLength(0);
	    	strQuery.append("update cmr0020 set cr_status='9', cr_clsdate=SYSDATE	\n");
	    	strQuery.append(" where cr_itemid=?										\n");
	    	pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, L_ItemId);
            rtn_cnt = pstmt.executeUpdate();
            
            pstmt.close();
            conn.commit();
            conn.close();
		    pstmt = null;
		    conn = null;

            return rtn_cnt;

		} catch (SQLException sqlexception) {
			if (conn != null){
				conn.close();conn = null;
			}
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.close();conn = null;
			}
			exception.printStackTrace();
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
    }//end of getTbl_Delete() method statement

    public Object[] getCbo_Editor_Add(String ItemId,String Editor) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>  rtList = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		Object[]		  rtObj		  = null;

		ConnectionContext connectionContext = new ConnectionResource();
		try {
			conn = connectionContext.getConnection();

			strQuery.setLength(0);
			strQuery.append("select a.cm_username,a.cm_userid          \n");
			strQuery.append("  from cmm0040 a,cmm0044 b,cmr0020 c      \n");
			strQuery.append(" where c.cr_itemid=?                      \n");//Txt_Editor
			strQuery.append("   and c.cr_syscd=b.cm_syscd              \n");
			strQuery.append("   and c.cr_jobcd=b.cm_jobcd              \n");
			strQuery.append("   and b.cm_closedt is null               \n");
			strQuery.append("   and b.cm_userid=a.cm_userid            \n");
			strQuery.append("   and a.cm_active='1'                    \n");
			strQuery.append("union                                     \n");
			strQuery.append("select cm_username,cm_userid              \n");
			strQuery.append("  from cmm0040                            \n");
			strQuery.append(" where cm_userid=?                        \n");//Txt_Editor
			strQuery.append("order by cm_username                      \n");
		    pstmt = conn.prepareStatement(strQuery.toString());
		    pstmt.setString(1, ItemId);
		    pstmt.setString(2, Editor);
			rs = pstmt.executeQuery();
			//boolean listFg = true;

			rst = new HashMap<String,String>();
			rst.put("userid","선택하세요");
			rtList.add(rst);

			while (rs.next()) {
				rst = new HashMap<String,String>();
				rst.put("userid","[" + rs.getString("cm_userid") + "] " + rs.getString("cm_username"));
				rst.put("cm_userid",rs.getString("cm_userid"));
				rst.put("cm_username",rs.getString("cm_username"));
				rtList.add(rst);
				rst = null;
				//listFg = false;
			}
			rs.close();
			pstmt.close();
			conn.close();
		    rs = null;
		    pstmt = null;
		    conn = null;

			rtObj = rtList.toArray();
			rtList.clear();
			rtList = null;

			return rtObj;

		} catch (SQLException sqlexception) {
			if (conn != null){
				conn.close();conn = null;
			}
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			if (conn != null){
				conn.close();conn = null;
			}
			exception.printStackTrace();
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rtObj != null)	rtObj = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
    }//end of getCbo_ReqCd_Add() method statement
    
    public int updateProgInfo(HashMap<String, String> etcData, ArrayList<HashMap<String,String>> dataList) throws SQLException, Exception {		
    	Connection        conn        = null;
    	PreparedStatement pstmt       = null;
    	StringBuffer      strQuery    = new StringBuffer();
    	
    	int i = 0;
    	int	ret = 0;
    	int	updtCnt = 0;
    	int paramCnt = 0;
    	boolean updtSw = false;

    	ConnectionContext connectionContext = new ConnectionResource();
    	try {
    		conn = connectionContext.getConnection();
    		
    		ret = 0;
    		for (i=0; i<dataList.size(); i++){
    			updtSw = false;
        		strQuery.setLength(0);
    			strQuery.append("update cmr0020 set \n");
    			if(etcData.get("aftjob") != null && !"0".equals(etcData.get("aftjob"))) {
    				updtSw = true;
    				strQuery.append("cr_jobcd = ? \n");
    			}
    			
    			if(etcData.get("aftrsrccd") != null && !"0".equals(etcData.get("aftrsrccd"))) {
    				if(updtSw) strQuery.append(", cr_rsrccd = ? \n");
    				else {
    					updtSw = true;
    					strQuery.append("cr_rsrccd = ? \n");
    				}
    			}
    			
    			if(etcData.get("aftowner") != null && !"0".equals(etcData.get("aftowner"))) {
    				if(updtSw) strQuery.append(", cr_owner = ? \n");
    				else {
    					updtSw = true;
    					strQuery.append("cr_owner = ? \n");
    				}
    			}
    			
    			if(etcData.get("aftsrid") != null && !"0".equals(etcData.get("aftsrid"))) {
    				if(updtSw) strQuery.append(", cr_isrid = ? \n");
    				else {
    					updtSw = true;
    					strQuery.append("cr_isrid = ? \n");
    				}
    			}
    			
    			if(etcData.get("aftdir") != null && !"0".equals(etcData.get("aftdir"))) {
    				if(updtSw) strQuery.append(", cr_dsncd = ? \n");
    				else {
    					updtSw = true;
    					strQuery.append("cr_dsncd = ? \n");
    				}
    			}
    			
    			strQuery.append("where cr_itemid = ? 		 				\n");
    			strQuery.append("  and (cr_status = '3' or cr_status = '0') \n");

//    			pstmt = conn.prepareStatement(strQuery.toString());
    			pstmt = new LoggableStatement(conn, strQuery.toString());

    			paramCnt = 0;
    			if(etcData.get("aftjob") != null && !"0".equals(etcData.get("aftjob"))) pstmt.setString(++paramCnt, etcData.get("aftjob"));
    			if(etcData.get("aftrsrccd") != null && !"0".equals(etcData.get("aftrsrccd"))) pstmt.setString(++paramCnt, etcData.get("aftrsrccd"));
    			if(etcData.get("aftowner") != null && !"0".equals(etcData.get("aftowner"))) pstmt.setString(++paramCnt, etcData.get("aftowner"));
    			if(etcData.get("aftsrid") != null && !"0".equals(etcData.get("aftsrid"))) pstmt.setString(++paramCnt, etcData.get("aftsrid"));
    			if(etcData.get("aftdir") != null && !"0".equals(etcData.get("aftdir"))) pstmt.setString(++paramCnt, etcData.get("aftdir"));
    			pstmt.setString(++paramCnt, dataList.get(i).get("cr_itemid"));
    			
    			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
    			updtCnt = pstmt.executeUpdate();
    			pstmt.close();
    			
    			if(updtCnt == 1) ret++;
    		}
			
    		pstmt.close();
			conn.close();
			
			pstmt = null;
			conn = null;

			return ret;

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmd0500.updateProgInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmd0500.updateProgInfo() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmd0500.updateProgInfo() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmd0500.updateProgInfo() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
	}
    
}//end of Cmd0500 class statement