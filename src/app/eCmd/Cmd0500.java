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
	        //pstmt =  new LoggableStatement(conn, strQuery.toString());
	        int CNT = 0;
	        pstmt.setString(++CNT, L_ItemId);
		    if (!SecuYn.equals("Y")){
		    	pstmt.setString(++CNT, UserId);
		    }
			pstmt.setString(++CNT, RsrcCd);
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
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
			String			  inProgName = "";
			if (etcData.get("Txt_ProgId") != null && !"".equals(etcData.get("Txt_ProgId"))) {
				inProgName = etcData.get("Txt_ProgId");
				allTrim(inProgName);
			}
			strQuery.setLength(0);
			strQuery.append("select a.cr_syscd,a.cr_dsncd,a.cr_rsrcname,a.cr_jobcd,   \n");
			strQuery.append("       a.cr_itemid,a.cr_lstver,b.cm_dirpath,a.cr_status, \n");
			strQuery.append("       a.cr_viewver,a.cr_rsrccd,g.cm_info,c.cm_sysmsg,   \n");
			strQuery.append("       (select cm_jobname from cmm0102                   \n");
			strQuery.append("          where cm_jobcd=a.cr_jobcd) cm_jobname,         \n");
			strQuery.append("       (select cm_codename from cmm0020                  \n");
			strQuery.append("          where cm_macode='JAWON'                        \n");
			strQuery.append("            and cm_micode=a.cr_rsrccd) JAWON,            \n");
			strQuery.append("       (select cm_codename from cmm0020                  \n");
			strQuery.append("          where cm_macode='CMR0020'                      \n");
			strQuery.append("            and cm_micode=a.cr_status) CMR0020           \n");
	        strQuery.append("  from cmm0030 c,cmr0020 a,cmm0070 b,cmm0036 g           \n");
	        strQuery.append(" where a.cr_syscd=?                                      \n");	 
	        strQuery.append("   and a.cr_syscd=c.cm_syscd                             \n");	
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
		    strQuery.append("   and a.cr_syscd=b.cm_syscd and a.cr_dsncd=b.cm_dsncd   \n");
		    strQuery.append("   and a.cr_syscd=g.cm_syscd and a.cr_rsrccd=g.cm_rsrccd \n");

		    //pstmt = conn.prepareStatement(strQuery.toString());
	        pstmt =  new LoggableStatement(conn, strQuery.toString());
	        int CNT = 0;
		    pstmt.setString(++CNT, etcData.get("L_Syscd"));
		    if ("Y".equals(etcData.get("SecuYn")) && "false".equals(etcData.get("ViewFg"))) {
		    	pstmt.setString(++CNT, etcData.get("UserId"));
		    }
		    if (inProgName.length()>0) pstmt.setString(++CNT, "%"+inProgName+"%");
		    if (etcData.get("Rsrccd") != null && !"".equals(etcData.get("Rsrccd"))) pstmt.setString(++CNT, etcData.get("Rsrccd"));
		    if (etcData.get("DirPath") != null && !"".equals(etcData.get("DirPath"))) pstmt.setString(++CNT, "%"+etcData.get("DirPath")+"%");
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
				rst.put("subset", "N");
				rst.put("base","0");
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
			ecamsLogger.error("## Cmd0500.getRsrcInfo_Rpt() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## SysInfo.getRsrcInfo_Rpt() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## SysInfo.getRsrcInfo_Rpt() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## SysInfo.getRsrcInfo_Rpt() Exception END ##");
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

    		strQuery.setLength(0);
    		strQuery.append("select a.cr_rsrcname,a.cr_story,a.cr_editor,a.cr_isrid,	     \n");
    		strQuery.append("       to_char(a.cr_opendate,'yyyy/mm/dd hh24:mi') cr_opendate, \n");
    		strQuery.append("       to_char(a.cr_lstdat,'yyyy/mm/dd hh24:mi') cr_lastdate,   \n");
    		strQuery.append("       a.cr_jobcd,a.cr_creator,a.cr_status,a.cr_lstver,         \n");
    		strQuery.append("       a.cr_rsrccd,a.cr_lstusr,b.cm_info,a.cr_syscd,            \n");
    		strQuery.append("       a.cr_ckinacpt,a.cr_devacpt,a.cr_testacpt,a.cr_realacpt,  \n");
    		strQuery.append("       (select cm_username from cmm0040                         \n");
    		strQuery.append("         where cm_userid=a.cr_creator) creator,                 \n");
    		strQuery.append("       (select cm_username from cmm0040                         \n");
    		strQuery.append("         where cm_userid=a.cr_editor) editor,                   \n");
    		strQuery.append("       (select cm_codename from cmm0020                         \n");
    		strQuery.append("         where cm_macode='JAWON'                                \n");
    		strQuery.append("           and cm_micode=a.cr_rsrccd) cm_codename,              \n");
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
				rst.put("cr_isrid", rs.getString("cr_isrid"));
				rst.put("WkSecu","false");
				if ("Y".equals(etcData.get("SecuYn")) || etcData.get("UserId").equals(rs.getString("cr_editor")) || 
					rs.getInt("progsecu")>0) {
					rst.put("WkSecu","true");
				}
				if (rs.getString("cr_creator") != null){
					rst.put("Lbl_Creator",rs.getString("creator"));
				}
				if (rs.getString("cr_editor") != null){
					rst.put("Lbl_Editor",rs.getString("editor"));
		        }

				
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


    public int getTbl_Update(String L_ItemId,String L_JobCd,String L_RsrcCd,
    		String Txt_ProgName,String Cbo_Dir_Code,
    		String Cbo_Editor,String SvRsrc,String svDsnCd, String srid) throws SQLException, Exception {
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
			strQuery.append("update cmr0020 set cr_jobcd=?, \n");//L_JobCd
			strQuery.append(" cr_rsrccd=?,cr_story=?,       \n");//Txt_ProgName
		    if (Cbo_Editor.length() > 0) strQuery.append(" cr_editor=?, \n");//Cbo_Editor
		    if (!"N".equals(srid)) strQuery.append(" cr_isrid=?, \n");//cboSr
		    strQuery.append(" cr_lastdate=SYSDATE               \n");
		    strQuery.append(" where cr_itemid=?                 \n");//L_ItemId
			pstmt = conn.prepareStatement(strQuery.toString());
			parmCnt = 0;
			pstmt.setString(++parmCnt, L_JobCd);
            pstmt.setString(++parmCnt, L_RsrcCd);
            pstmt.setString(++parmCnt, Txt_ProgName);
            
            if (Cbo_Editor.length() > 0) pstmt.setString(++parmCnt, Cbo_Editor);
            if (!"N".equals(srid)) {
            	if("P".equals(srid)) pstmt.setString(++parmCnt, "");
            	else pstmt.setString(++parmCnt, srid);
            }
            pstmt.setString(++parmCnt, L_ItemId);
            rtn_cnt = pstmt.executeUpdate();
            pstmt.close();

            if (!svDsnCd.equals(Cbo_Dir_Code)) {
		    	strQuery.setLength(0);
		    	strQuery.append("update cmr0020 set cr_dsncd=? \n");//Cbo_Dir_code
		    	strQuery.append(" where cr_itemid=?            \n");//L_ItemId
				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt =  new LoggableStatement(conn, strQuery.toString());
	            pstmt.setString(1, Cbo_Dir_Code);
	            pstmt.setString(2, L_ItemId);
	            //ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	            rtn_cnt = pstmt.executeUpdate();
	            pstmt.close();

		    	strQuery.setLength(0);
		    	strQuery.append("update cmr1010 set cr_dsncd=? \n");//Cbo_Dir_code
		    	strQuery.append(" where cr_itemid=?            \n");//L_ItemId
				pstmt = conn.prepareStatement(strQuery.toString());
				//pstmt =  new LoggableStatement(conn, strQuery.toString());
	            pstmt.setString(1, Cbo_Dir_Code);
	            pstmt.setString(2, L_ItemId);
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

    public int getItem_Delete(String L_ItemId) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		String            SysCd       = "";
		String            DsnCd       = "";
		String            RsrcName    = "";
		String            RsrcCd      = "";
		String            strItemId   = null;
		String            strBefDsn   = null;
		String            strAftDsn   = null;
		String            strWork1    = null;
		String            strWork3    = null;
		String            strDevPath  = null;
		String            strRsrcCd   = null;
		String            strRsrcName = null;
		int               j           = 0;
		ArrayList<String> qryAry = null;
		int				  nRet1 = 0;
		int				  nRet2 = 0;
		int				  qryFlag = 0;
		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();

			strQuery.setLength(0);
			strQuery.append("select a.cr_syscd,a.cr_rsrccd,a.cr_rsrcname,b.cm_dirpath \n");
			strQuery.append("  from cmm0070 b,cmr0020 a                               \n");
			strQuery.append(" where a.cr_itemid=? and a.cr_syscd=b.cm_syscd           \n");
			strQuery.append("   and a.cr_dsncd=b.cm_dsncd                             \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, L_ItemId);
			rs = pstmt.executeQuery();
			if (rs.next()) {
				SysCd = rs.getString("cr_syscd");
				DsnCd = rs.getString("cm_dirpath");
				RsrcName = rs.getString("cr_rsrcname");
				RsrcCd = rs.getString("cr_rsrccd");
			}
			rs.close();
			pstmt.close();

        	Cmd0100 cmd0100 = new Cmd0100();

            strQuery.setLength(0);
	        strQuery.append("select b.cm_samename,b.cm_samersrc,b.cm_basedir,         \n");
			strQuery.append("       b.cm_samedir,b.cm_basename,b.cm_cmdyn,a.cm_info   \n");
			strQuery.append("  from cmm0036 a,cmm0037 b                               \n");
			strQuery.append(" where b.cm_syscd=? and b.cm_rsrccd=?                    \n");
			strQuery.append("   and b.cm_factcd='04'                                  \n");
			strQuery.append("   and b.cm_syscd=a.cm_syscd                             \n");
			strQuery.append("   and b.cm_samersrc=a.cm_rsrccd                         \n");

	        pstmt = conn.prepareStatement(strQuery.toString());
	        pstmt.setString(1, SysCd);
	        pstmt.setString(2, RsrcCd);
	        rs = pstmt.executeQuery();

	        while (rs.next()) {
	        	strBefDsn = "";
	        	strAftDsn = "";

	        	if (rs.getString("cm_basedir") != null) strBefDsn = rs.getString("cm_basedir");
	        	if (RsrcName.indexOf(".") > -1) {
	        		strWork1 = RsrcName.substring(0,RsrcName.indexOf("."));
	        	}
	        	else strWork1 = RsrcName;
	        	//ecamsLogger.debug("+++++++++++++++cm_basedir,strWork1=========>"+strBefDsn+ ","+strWork1);
	        	if (!rs.getString("cm_basename").equals("*")) {
	        		strWork3 = rs.getString("cm_basename");
	        		while (strWork3 == "") {
	        			j = strWork3.indexOf("*");
	        			if (j > -1) {
	        				//strWork2 = strWork3.substring(0, j);
	        				strWork3 = strWork3.substring(j + 1);
	        				if (strWork3.equals("*")) strWork3 = "";
	        			} else {
	        				//strWork2 = strWork3;
	        				strWork3 = "";
	        			}
	        			if (strWork3 == "") break;
	        		}
	        	}
	        	strQuery.setLength(0);
	        	strQuery.append("select \n");
	        	if (rs.getString("cm_cmdyn").equals("Y")) {
	        		strWork1 = rs.getString("cm_samename").replace("*",strWork1);
			   		qryAry = new ArrayList<String>();
			   		nRet1 = 0;
			   		nRet2 = 0;

			   		while( (nRet2 = strWork1.indexOf("'")) != -1){
			   			if (qryFlag == 0){
			   				strQuery.append(strWork1.substring(0, nRet2)+ " \n");
			   				strWork1 = strWork1.substring(nRet2+1);
			   				qryFlag = 1;
			   			}
			   			else{
			   				qryAry.add(strWork1.substring(0, nRet2));
			   				strWork1 = strWork1.substring(nRet2+1);
			   				strQuery.append(" ? \n");
			   				qryFlag = 0;
			   			}
			   		}
			   		strQuery.append(strWork1+ " \n");
	        	}
	        	else{
	        		strQuery.append(" ? \n");
	        	}
	        	strQuery.append("as relatId  from dual \n");

	        	//pstmt2 = conn.prepareStatement(strQuery.toString());
	        	pstmt2 = new LoggableStatement(conn, strQuery.toString());

			   	nRet1 = 1;
				if (rs.getString("cm_cmdyn").equals("Y")){
	        		for (nRet2 = 0;nRet2<qryAry.size();nRet2++){
	        			pstmt2.setString(nRet1++,qryAry.get(nRet2));
	        		}
	        	}
	        	else{
			   		strWork1 = rs.getString("cm_samename").replace("*",strWork1);
			   		pstmt2.setString(nRet1++,strWork1);
	        	}

				ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
    	        rs2 = pstmt2.executeQuery();
    	        if (rs2.next()) {
    	        	strWork1 = rs2.getString("relatId");
    	        }
    	        else{
    	        	strWork1 = "";
    	        }
    	        rs2.close();
    	        pstmt2.close();

	        	strRsrcName = strWork1;
	        	strRsrcCd = rs.getString("cm_samersrc");
	        	if (rs.getString("cm_samedir") != null) strAftDsn = rs.getString("cm_samedir");

	        	if (rs.getString("cm_samersrc").equals("52")) {
	        		strQuery.setLength(0);
	        		strQuery.append("select a.cm_volpath  from cmm0038 a,cmm0031 b  \n");
	        		strQuery.append(" where a.cm_syscd=? and a.cm_svrcd='01'        \n");
	        		strQuery.append("   and a.cm_rsrccd=? and a.cm_syscd=b.cm_syscd \n");
	        		strQuery.append("   and a.cm_svrcd=b.cm_svrcd and a.cm_seqno=b.cm_seqno  \n");
	        		strQuery.append("   and b.cm_closedt is null                    \n");
	        		pstmt2 = conn.prepareStatement(strQuery.toString());
	        		pstmt2.setString(1, SysCd);
	        		pstmt2.setString(2, RsrcCd);
	    	        rs2 = pstmt2.executeQuery();
	    	        if (rs2.next()) {
	    	        	strDevPath = rs2.getString("cm_volpath");
	    	        }

	    	        rs2.close();
	    	        pstmt2.close();
	        	} else strDevPath = DsnCd.replace(strBefDsn, strAftDsn);
	        	//ecamsLogger.debug("+++++++++++++++strRsrcCd,strDevPath=========>"+strRsrcCd+ ","+strDevPath);

	        	strQuery.setLength(0);
        		strQuery.append("select cm_dsncd from cmm0070            \n");
        		strQuery.append(" where cm_syscd=? and cm_dirpath=?      \n");
        		pstmt2 = conn.prepareStatement(strQuery.toString());
        		pstmt2.setString(1, SysCd);
        		pstmt2.setString(2, strDevPath);
    	        rs2 = pstmt2.executeQuery();
    	        if (rs2.next()) {
    	        	strAftDsn = rs2.getString("cm_dsncd");
    	        }
    	        rs2.close();
    	        pstmt2.close();

    	        strItemId = "";
    	        strQuery.setLength(0);
    	        strQuery.append("select cr_itemid from cmr0020        \n");
    	        strQuery.append(" where cr_syscd=?                    \n");
    	        strQuery.append("   and upper(cr_rsrcname)=upper(?)   \n");
    	        if (strAftDsn != "" && strAftDsn != null) {
    	        	strQuery.append("and cr_dsncd=?                   \n");
    	        } else {
    	        	strQuery.append("and cr_rsrccd=?                  \n");
    	        }
    	        strQuery.append("   and cr_status='3'                 \n");
    	        pstmt2 = conn.prepareStatement(strQuery.toString());
    	        //pstmt2 =  new LoggableStatement(conn, strQuery.toString());
    	        pstmt2.setString(1, SysCd);
        		pstmt2.setString(2, strRsrcName);
        		if (strAftDsn != "" && strAftDsn != null)
        			pstmt2.setString(3, strAftDsn);
        		else pstmt2.setString(3, strRsrcCd);
        		//ecamsLogger.debug(((LoggableStatement)pstmt2).getQueryString());
    	        rs2 = pstmt2.executeQuery();
    	        if (rs2.next()) {
    	        	strItemId = rs2.getString("cr_itemid");
    	        }
    	        rs2.close();
    	        pstmt2.close();

    	        if (strItemId !="" && strItemId != null) {
    	        	cmd0100.cmr0020_Delete_sub("",strItemId,conn);
    	        }
	        }
	        rs.close();
	        pstmt.close();

			cmd0100.cmr0020_Delete_sub("", L_ItemId, conn);

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

    public int getTbl_Delete(String L_ItemId) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		int				  rtn_cnt     = 0;

		ConnectionContext connectionContext = new ConnectionResource();
		try {
			conn = connectionContext.getConnection();
			/*
	        strQuery.setLength(0);
	    	strQuery.append("delete cmr0025 \n");
	    	strQuery.append(" where cr_itemid=? \n");//L_ItemId
			pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, L_ItemId);
            rtn_cnt = pstmt.executeUpdate();
            pstmt.close();

	        strQuery.setLength(0);
	    	strQuery.append("delete cmr0021 \n");
	    	strQuery.append(" where cr_itemid=? \n");//L_ItemId
			pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, L_ItemId);
            rtn_cnt = pstmt.executeUpdate();
            pstmt.close();

	        strQuery.setLength(0);
	    	strQuery.append("delete cmr1010 \n");
	    	strQuery.append(" where cr_itemid=? \n");//L_ItemId
			pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, L_ItemId);
            rtn_cnt = pstmt.executeUpdate();
            pstmt.close();

	        strQuery.setLength(0);
	    	strQuery.append("delete cmr0022 \n");
	    	strQuery.append(" where cr_itemid=? \n");//L_ItemId
			pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, L_ItemId);
            rtn_cnt = pstmt.executeUpdate();
            pstmt.close();

	        strQuery.setLength(0);
	    	strQuery.append("delete cmr0022 \n");
	    	strQuery.append(" where cr_baseitem=? \n");//L_ItemId
			pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, L_ItemId);
            rtn_cnt = pstmt.executeUpdate();
            pstmt.close();

	        strQuery.setLength(0);
	    	strQuery.append("delete cmr0020 \n");
	    	strQuery.append(" where cr_itemid=? \n");//L_ItemId
			pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, L_ItemId);
            rtn_cnt = pstmt.executeUpdate();
            */
			
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

}//end of Cmd0500 class statement
