/*****************************************************************************************
	1. program ID	: Cmr0600.java
	2. create date	: 2012.08. 08
	3. auth		    :
	4. update date	:
	5. auth		    :
	6. description	: 롤백
*****************************************************************************************/

package app.eCmr;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.apache.log4j.Logger;
import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;
import java.util.ArrayList;
import java.util.HashMap;
import app.common.*;


/**
 * @author bigeyes
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class Cmr0600{

    /**
     * Logger Class Instance Creation
     * logger
     */

    Logger ecamsLogger  = EcamsLogger.getLoggerInstance();

	/**
	 * USER NAME
	 * @param user_id
	 * @return String
	 * @throws SQLException
	 * @throws Exception
	 */
    public Object[] getBefList(String UserId,String QryCd,String stDate,String edDate,String SysCd) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		int               parmCnt     = 0;

		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();
			
			strQuery.setLength(0);
			strQuery.append("select a.cr_acptdate,a.cr_acptno,a.cr_editor,           \n");
			strQuery.append("       a.cr_syscd,a.cr_passcd,b.cm_sysmsg,b.cm_systype, \n");
			strQuery.append("       to_char(a.cr_acptdate,'yyyy/mm/dd hh24:mi:ss') acptdate,\n");
			strQuery.append("       to_char(a.cr_prcdate,'yyyy/mm/dd hh24:mi:ss') prcdate,\n");
			strQuery.append("       to_char(sysdate-1,'yyyymmdd') sysday,            \n");
			strQuery.append("       a.cr_itsmid,a.cr_itsmtitle,                      \n");
			strQuery.append("       (select cm_username from cmm0040 where cm_userid=a.cr_editor) cm_username \n");
			strQuery.append("  from cmr1000 a,cmm0030 b                              \n");
			strQuery.append(" where a.cr_qrycd='04'                                  \n");
			strQuery.append("   and a.cr_syscd = b.cm_syscd                          \n");
			if (SysCd != null && SysCd != "") strQuery.append("and a.cr_syscd=?      \n");
			strQuery.append("and a.cr_status in ('8','9')                            \n");
			if ("".equals(stDate) || stDate == null) {
				strQuery.append("and to_char(a.cr_acptdate,'yyyymmdd')>=to_char(sysdate-1,'yyyymmdd') \n");
				strQuery.append("and to_char(a.cr_acptdate,'yyyymmdd')<=to_char(sysdate,'yyyymmdd')   \n");
			} else {
				strQuery.append("and to_char(a.cr_acptdate,'yyyymmdd')>=?            \n");
				strQuery.append("and to_char(a.cr_acptdate,'yyyymmdd')<=?            \n");
			}
			strQuery.append("and a.cr_editor=?                                       \n");
			strQuery.append("and exists (select 1 from cmr0020 bb,cmr1010 aa         \n");
			strQuery.append("             where bb.cr_realacpt=a.cr_acptno           \n");
			strQuery.append("               and bb.cr_status='0'                     \n");
			strQuery.append("               and bb.cr_realacpt=aa.cr_acptno          \n");
			strQuery.append("               and aa.cr_status<>'3'                    \n");
			strQuery.append("               and aa.cr_itemid=aa.cr_baseitem          \n");
			strQuery.append("               and substr(aa.cr_befviewver,1,instr(aa.cr_befviewver,'.')-1)>0)  \n");
			strQuery.append(" order by cr_acptdate desc                              \n");

			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			if (SysCd != null && !"".equals(SysCd)) pstmt.setString(++parmCnt, SysCd);
			if (!"".equals(stDate) && stDate != null) {
				pstmt.setString(++parmCnt, stDate);
				pstmt.setString(++parmCnt, edDate);
			}
			pstmt.setString(++parmCnt, UserId);
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            rs = pstmt.executeQuery();
            while (rs.next()) {
        		rst = new HashMap<String, String>();
				rst.put("ID", Integer.toString(rs.getRow()));
				rst.put("acptno", rs.getString("cr_acptno").substring(0,4)+"-"+
						          rs.getString("cr_acptno").substring(4,6)+"-"+
						          rs.getString("cr_acptno").substring(6));
				rst.put("acptdate", rs.getString("acptdate"));
				rst.put("prcdate", rs.getString("prcdate"));
				if (rs.getString("cr_passcd") != null) rst.put("cr_passcd", rs.getString("cr_passcd"));
				rst.put("cr_acptno", rs.getString("cr_acptno"));
				rst.put("cr_syscd", rs.getString("cr_syscd"));
				rst.put("cm_sysmsg", rs.getString("cm_sysmsg"));
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("cc_srid", rs.getString("cr_itsmid"));
				rst.put("cc_reqtitle", rs.getString("cr_itsmtitle"));
				rst.put("cr_editor", rs.getString("cr_editor"));
				rst.put("sysday", rs.getString("sysday"));
				rsval.add(rst);
				rst = null;
            }
			rs.close();
			pstmt.close();
			
			/* 20190807 미사용 제거
			if (rsval.size() == 0) {
				strQuery.setLength(0);
				strQuery.append("select to_char(sysdate-1,'yyyymmdd') sysday   \n");
				strQuery.append("  from dual                                   \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				rs = pstmt.executeQuery();
				if (rs.next()) {
					rst = new HashMap<String, String>();
					rst.put("ID", Integer.toString(rs.getRow()));
					rst.put("sysday", rs.getString("sysday"));
					rsval.add(rst);
					rst = null;
				}
				rs.close();
				pstmt.close();
			}
			*/
			conn.close();
			conn = null;
			pstmt = null;
			rs = null;

			return rsval.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0600.getBefList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0600.getBefList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0600.getBefList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0600.getBefList() Exception END ##");
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
					ecamsLogger.error("## Cmr0600.getBefList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getBefList() method statement

	public Object[] getFileList(HashMap<String,String> etcData) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>		  rtList	  = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		ConnectionContext connectionContext = new ConnectionResource();
		int				  pstmtcount  = 1;
		//int               cnt = 0;

		try {
			conn = connectionContext.getConnection();
			pstmtcount = 1;
			strQuery.setLength(0);
			strQuery.append("select a.CR_ITEMID,a.cr_rsrcname,a.cr_story,a.cr_lstver,a.cr_editor, \n");
			strQuery.append("       to_char(a.cr_lastdate,'yyyy/mm/dd') cr_lastdate,  \n");
			strQuery.append("       a.cr_syscd,a.cr_rsrccd,a.cr_dsncd,                \n");
			strQuery.append("       a.cr_jobcd,a.cr_status,i.cm_deptseq,a.cr_realacpt,\n");
	    	strQuery.append("       nvl(a.cr_realdep,0) cr_realdep,a.cr_realver,       \n");
			strQuery.append("       c.cm_codename as codename,d.cm_username,          \n");
			strQuery.append("       e.cm_dirpath, f.cm_codename as JAWON, h.cm_info,  \n");
			strQuery.append("       b.cm_sysmsg,lpad(h.cm_stepsta,4,'0') prcreq,      \n");
			strQuery.append("       nvl(h.cm_vercnt,9999) vercnt                      \n");
			strQuery.append("  from cmm0036 h,cmm0020 f,cmm0070 e,cmm0040 d,\n");
			strQuery.append("       cmm0030 b,cmm0040 i,cmm0020 c,cmr0020 a           \n");
			strQuery.append(" where i.cm_userid=?                                     \n");
			strQuery.append("   and a.cr_syscd=?                                      \n");
			if (etcData.get("rsrccd") != null && etcData.get("rsrccd").length() > 0){
				strQuery.append("   and a.cr_rsrccd=?                                 \n");
			}
			if (etcData.get("rsrcname") != null && etcData.get("rsrcname").length() > 0){
				strQuery.append("and upper(a.cr_rsrcname) like upper(?)               \n");
			}
			if (etcData.get("dsncd") != null && etcData.get("dsncd") != "") {
			   strQuery.append("and a.cr_dsncd = ?                                    \n");
			}
			if (etcData.get("dirpath") != null && etcData.get("dirpath") != "") {
			   strQuery.append("and e.cm_dirpath like ?                               \n");
			}
		    strQuery.append("and substr(h.cm_info,12,1)='1'                           \n");
		    strQuery.append("and cr_status not in('9')                                \n");
		    strQuery.append("and cr_realver>1                                         \n");
			strQuery.append("and a.cr_editor=d.cm_userid                              \n");
			strQuery.append("and c.cm_macode='CMR0020' and a.cr_status=c.cm_micode    \n");
			strQuery.append("and f.cm_macode='JAWON' and a.cr_rsrccd=f.cm_micode      \n");
			strQuery.append("and a.cr_syscd=e.cm_syscd and a.cr_dsncd=e.cm_dsncd      \n");
			strQuery.append("and a.cr_syscd=h.cm_syscd and a.cr_rsrccd=h.cm_rsrccd    \n");
			strQuery.append("and a.cr_syscd=b.cm_syscd                                \n");
			//pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(pstmtcount++,etcData.get("userid"));
			pstmt.setString(pstmtcount++, etcData.get("syscd"));
			if (etcData.get("rsrccd") != null && etcData.get("rsrccd").length() > 0) {
				pstmt.setString(pstmtcount++, etcData.get("rsrccd"));
			}
			if (etcData.get("rsrcname") != null && etcData.get("rsrcname").length() > 0){
		        pstmt.setString(pstmtcount++, "%"+etcData.get("rsrcname")+"%");
			}
			if (etcData.get("dsncd") != null && etcData.get("dsncd") != "")
	            pstmt.setString(pstmtcount++, etcData.get("dsncd"));
			if (etcData.get("dirpath") != null && etcData.get("dirpath") != "") {
				pstmt.setString(pstmtcount++, etcData.get("dirpath") + "%");
			}
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            rs = pstmt.executeQuery();
			while (rs.next()){
				rst = new HashMap<String,String>();
				rst.put("ID", Integer.toString(rs.getRow()));
				rst.put("cm_grpname", rs.getString("cm_sysmsg"));
				if(rs.getString("cm_dirpath") != ""){
					rst.put("cm_dirpath",rs.getString("cm_dirpath"));
				}
				if(rs.getString("cr_rsrcname") != ""){
					rst.put("cr_rsrcname",rs.getString("cr_rsrcname"));
				}
				if(rs.getString("cr_story") != ""){
					rst.put("cr_story",rs.getString("cr_story"));
				}
				if(rs.getString("jawon") != ""){
					rst.put("jawon",rs.getString("jawon"));
				}
				rst.put("cr_version",rs.getString("cr_lstver"));
				rst.put("cr_realdep",rs.getString("cr_realdep"));
				rst.put("ermsg", "정상");
				
				strQuery.setLength(0);
				strQuery.append("select cr_realbefver from cmr1010  \n");
				strQuery.append(" where cr_acptno=? and cr_itemid=? \n");
				pstmt2 = conn.prepareStatement(strQuery.toString());
				pstmt2.setString(1, rs.getString("cr_realacpt"));
				pstmt2.setString(2, rs.getString("CR_ITEMID"));
				rs2 = pstmt2.executeQuery();
				if (rs2.next()) {
					rst.put("cr_realbefver",rs2.getString("cr_realbefver"));
					if (rs2.getInt("cr_realbefver") == 0) {
						rst.put("ermsg", "롤백대상없음");
					}
				} else {
					rst.put("ermsg", "운영배포신청건이상");
				}
				rs2.close();
				pstmt2.close();

				if (rst.get("ermsg").equals("정상")) {
					strQuery.setLength(0);
					strQuery.append("select count(*) cnt from cmr0025 \n");
					strQuery.append(" where CR_ITEMID=? 		      \n");
					pstmt2 = conn.prepareStatement(strQuery.toString());
					pstmt2.setString(1, rs.getString("CR_ITEMID"));
					rs2 = pstmt2.executeQuery();
					if (rs2.next()) {
						if (rs2.getInt("cnt")>1) {
							rst.put("cr_version","sel");
						} else {
							rst.put("ermsg", "대상없음");
						}
					}
					rs2.close();
					pstmt2.close();
				}
				rst.put("cr_lstver",rs.getString("cr_lstver"));
				if(rs.getString("CR_EDITOR") != ""){
					rst.put("cm_username",rs.getString("cm_username"));
				}
				if(rs.getString("cr_lastdate") != ""){
					rst.put("cr_lastdate",rs.getString("cr_lastdate"));
				}
				if(rs.getString("CodeName") != ""){
					rst.put("codename",rs.getString("CodeName"));
				}
				if(rs.getString("cr_syscd") != ""){
					rst.put("cr_syscd",rs.getString("cr_syscd"));
				}
				if(rs.getString("CR_RSRCCD") != ""){
					rst.put("cr_rsrccd",rs.getString("CR_RSRCCD"));
				}
				if(rs.getString("cr_dsncd") != ""){
					rst.put("cr_dsncd",rs.getString("cr_dsncd"));
				}
				if(rs.getString("cr_jobcd") != ""){
					rst.put("cr_jobcd",rs.getString("cr_jobcd"));
				}
				if(rs.getString("cr_status") != ""){
					rst.put("cr_status",rs.getString("cr_status"));
				}
				if(rs.getString("cm_info") != ""){
					rst.put("cm_info",rs.getString("cm_info"));
				}
				rst.put("cr_itemid", rs.getString("cr_itemid"));
				rst.put("baseitem", rs.getString("cr_itemid"));
				rst.put("prcseq", rs.getString("prcreq"));

				rst.put("cr_befver", rs.getString("cr_realdep"));
				if (rs.getInt("vercnt") == 0) {
					if (rs.getInt("cr_realver") >= 9999) rst.put("cr_aftver", "1");
					else rst.put("cr_aftver", Integer.toString(rs.getInt("cr_realver")+1));
				} else {
					if (rs.getInt("cr_realver") >= rs.getInt("vercnt")) {
						rst.put("cr_aftver", "1");
					} else rst.put("cr_aftver", Integer.toString(rs.getInt("cr_realver")+1));
				}
				if (rst.get("ermsg").equals("정상")) rst.put("selected_flag","0");
				else rst.put("selected_flag","1");
				rtList.add(rst);
				rst = null;
			}//end of while-loop statement

			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			pstmt = null;
			rs = null;

			return rtList.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0600.getFileList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0600.getFileList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0600.getFileList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0600.getFileList() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rtList != null)  rtList = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0600.getFileList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}

	public Object[] getBefReq_Prog(String UserId,String AcptNo) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();

		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		ConnectionContext connectionContext = new ConnectionResource();

		String            strAftViewVer[] = null;
		String            strViewVer[] = null;
		try {
			rsval.clear();
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
			strQuery.append("select a.cr_rsrcname,a.cr_itemid,a.cr_story,a.cr_lstver, \n");
			strQuery.append("       to_char(a.cr_lastdate,'yyyy/mm/dd') cr_lastdate,  \n");
			strQuery.append("       a.cr_syscd,a.cr_rsrccd,a.cr_dsncd,a.cr_lstusr,    \n");
			strQuery.append("       a.cr_jobcd,a.cr_status,g.CR_QRYCD,                \n");
			strQuery.append("       lpad(h.cm_stepsta,4,'0') prcreq,   	              \n");
			strQuery.append("       h.cm_info,nvl(h.cm_vercnt,9999) vercnt,           \n");
			strQuery.append("       g.cr_befver,g.cr_befviewver,                      \n");
			strQuery.append("       g.cr_version,g.cr_aftviewver,g.cr_veryn,          \n");
			strQuery.append("       g.cr_acptno,a.cr_viewver,                         \n");
			strQuery.append("       b.cm_sysgb,b.cm_systype,                          \n");
			strQuery.append("       (select cm_codename from cmm0020                  \n");
			strQuery.append("         where cm_macode='CMR0020'                       \n");
			strQuery.append("           and cm_micode=a.cr_status) codename,          \n");
			strQuery.append("       (select cm_codename from cmm0020                  \n");
			strQuery.append("         where cm_macode='JAWON'                         \n");
			strQuery.append("           and cm_micode=a.cr_rsrccd) JAWON,             \n");
			strQuery.append("       (select cm_dirpath from cmm0070                   \n");
			strQuery.append("         where cm_syscd=a.cr_syscd                       \n");
			strQuery.append("           and cm_dsncd=a.cr_dsncd) cm_dirpath,          \n");
			strQuery.append("       (select cm_username from cmm0040                  \n");
			strQuery.append("         where cm_userid=a.cr_lstusr) cm_username        \n");
			strQuery.append("  from cmm0030 b,cmm0036 h,cmr0020 a,cmr1010 g    	      \n");
			strQuery.append(" where g.cr_acptno=? 						   			  \n");
			strQuery.append("   and g.cr_status<>'3'                       			  \n");
			strQuery.append("   and g.cr_itemid=g.CR_BASEITEM              			  \n");
			strQuery.append("   and g.cr_itemid=a.cr_itemid                			  \n");
		    strQuery.append("   and a.cr_status not in('9','C')              		  \n");
			strQuery.append("   and a.cr_syscd=h.cm_syscd            			      \n");
			strQuery.append("   and a.cr_rsrccd=h.cm_rsrccd 		           	      \n");
			strQuery.append("   and h.cm_syscd=b.cm_syscd  		           	          \n");
			//pstmt = conn.prepareStatement(strQuery.toString());
			pstmt = new LoggableStatement(conn,strQuery.toString());
			pstmt.setString(1,AcptNo);
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            rs = pstmt.executeQuery();
            rsval.clear();
			while (rs.next()){
				rst = new HashMap<String,String>();
				rst.put("ID", Integer.toString(rs.getRow()));
				if(rs.getString("cm_dirpath") != ""){
					rst.put("cm_dirpath",rs.getString("cm_dirpath"));
				}
				if(rs.getString("cr_rsrcname") != ""){
					rst.put("cr_rsrcname",rs.getString("cr_rsrcname"));
				}
				if(rs.getString("cr_story") != ""){
					rst.put("cr_story",rs.getString("cr_story"));
				}
				if(rs.getString("jawon") != ""){
					rst.put("jawon",rs.getString("jawon"));
				}
				rst.put("cr_befviewver",rs.getString("cr_aftviewver"));
				rst.put("cr_aftviewver",rs.getString("cr_befviewver"));
				rst.put("cr_befver",rs.getString("cr_version"));
				rst.put("cr_version",rs.getString("cr_befver"));
				rst.put("cr_aftver",rs.getString("cr_befver"));
				rst.put("cm_sysgb",rs.getString("cm_sysgb"));
				rst.put("cm_systype",rs.getString("cm_systype"));
				rst.put("cr_acptno",rs.getString("cr_acptno"));
				rst.put("selAcptno",AcptNo);
				rst.put("cr_lstver",rs.getString("cr_lstver"));
				rst.put("cm_username",rs.getString("cm_username"));
				if(rs.getString("cr_lastdate") != ""){
					rst.put("cr_lastdate",rs.getString("cr_lastdate"));
				}
				if(rs.getString("CodeName") != ""){
					rst.put("codename",rs.getString("CodeName"));
				}
				if(rs.getString("cr_syscd") != ""){
					rst.put("cr_syscd",rs.getString("cr_syscd"));
				}
				if(rs.getString("CR_RSRCCD") != ""){
					rst.put("cr_rsrccd",rs.getString("CR_RSRCCD"));
				}
				if(rs.getString("cr_dsncd") != ""){
					rst.put("cr_dsncd",rs.getString("cr_dsncd"));
				}
				if(rs.getString("cr_jobcd") != ""){
					rst.put("cr_jobcd",rs.getString("cr_jobcd"));
				}
				if(rs.getString("cr_status") != ""){
					rst.put("cr_status",rs.getString("cr_status"));
				}
				if(rs.getString("cm_info") != ""){
					rst.put("cm_info",rs.getString("cm_info"));
				}
				rst.put("prcseq", rs.getString("prcreq"));
				rst.put("cr_itemid", rs.getString("cr_itemid"));
				rst.put("baseitem", rs.getString("cr_itemid"));
				rst.put("ReqCD", rs.getString("CR_QRYCD"));


				rst.put("ersw","N");
				rst.put("ermsg","정상");
				rst.put("selected_flag", "0");
				strViewVer = rs.getString("cr_viewver").split("\\.");
				strAftViewVer = rs.getString("cr_aftviewver").split("\\.");
				if (!strViewVer[0].equals(strAftViewVer[0])) {
					rst.put("selected_flag", "1");
					rst.put("ermsg","최종기록아님");
					rst.put("ersw","Y");
				}

				strAftViewVer = rs.getString("cr_befviewver").split("\\.");
				if (Integer.parseInt(strAftViewVer[0])<1) {
					rst.put("selected_flag", "1");
					rst.put("ermsg","롤백대상없음");
					rst.put("ersw","Y");
				}
				if ("1".equals(rs.getString("cm_info").substring(11,12)) &&   //버전관리
					"0".equals(rs.getString("cm_info").substring(24,25)) &&   //빌드서버체크인
					"N".equals(rs.getString("cr_veryn"))) {                   //운영에서 컴파일안하는경우
					strQuery.setLength(0);
					strQuery.append("select count(*) cnt from cmr0025 \n");
					strQuery.append(" where cr_itemid=?               \n");
					strQuery.append("   and cr_ver=?                  \n");
					pstmt2 = conn.prepareStatement(strQuery.toString());
		//			pstmt2 = new LoggableStatement(conn,strQuery.toString());
					pstmt2.setString(1, rs.getString("cr_itemid"));
					pstmt2.setString(2, rs.getString("cr_befver"));
		//			//ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
					rs2 = pstmt2.executeQuery();
					if (rs2.next()) {
						if (rs2.getInt("cnt")==0) {
							rst.put("ermsg", "버전파일없음");
							rst.put("selected_flag", "1");
							rst.put("ersw","Y");
						}
					}
					rs2.close();
					pstmt2.close();
				}

				if (rst.get("ersw").equals("Y")) {
					if (!rs.getString("cr_status").equals("0")) {
						rst.put("selected_flag","1");
					} else {
						rst.put("selected_flag","0");
					}
				}
				rsval.add(rst);
				rst = null;
			}//end of while-loop statement

			rs.close();
			pstmt.close();

			conn.close();
			conn = null;
			pstmt = null;
			pstmt2 = null;
			rs = null;
			rs2 = null;
			//ecamsLogger.debug(rsval.toString());

			return rsval.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0600.getBefReq_Prog() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0600.getBefReq_Prog() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0600.getBefReq_Prog() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0600.getBefReq_Prog() Exception END ##");
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
					ecamsLogger.error("## Cmr0600.getBefReq_Prog() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getBefReq_Prog() method statement

	public Object[] getDownFileList(ArrayList<HashMap<String,String>> fileList,HashMap<String,String> etcData) throws SQLException, Exception {
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>		  rtList	  = new ArrayList<HashMap<String, String>>();
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2      = null;
		ConnectionContext connectionContext = new ConnectionResource();
		ResultSet         rs          = null;
		ResultSet         rs2         = null;
		HashMap<String, String>			  rst		  = null;
		int               reqCnt      = 0;
		int               addCnt      = 0;
		int               i = 0;
		int               k = 0;
		int 			  cnt = 0 ;
		boolean           findSw = false;

		String            strAftViewVer[] = null;
		String            strViewVer[] = null;
		try {
			conn = connectionContext.getConnection();
			rtList.clear();
			
			
			for (i=0;fileList.size()>i;i++) {
				rst = new HashMap<String,String>();
				rst = fileList.get(i);
	            
				reqCnt = addCnt + 1;
				rst.put("seq", Integer.toString(reqCnt));
				rtList.add(addCnt++, rst);
				rst = null;

				findSw = false;
	        	strQuery.setLength(0);
	        	cnt = 0 ;
	        	strQuery.setLength(0);
				strQuery.append("select a.cr_rsrcname,a.cr_itemid,a.cr_story,a.cr_lstver, \n");
				strQuery.append("       to_char(a.cr_lastdate,'yyyy/mm/dd') cr_lastdate,  \n");
				strQuery.append("       a.cr_syscd,a.cr_rsrccd,a.cr_dsncd,a.cr_lstusr,    \n");
				strQuery.append("       a.cr_jobcd,a.cr_status,g.CR_QRYCD,                \n");
				strQuery.append("       lpad(h.cm_stepsta,4,'0') prcreq,   	              \n");
				strQuery.append("       h.cm_info,nvl(h.cm_vercnt,9999) vercnt,           \n");
				strQuery.append("       g.cr_befver,g.cr_befviewver,                      \n");
				strQuery.append("       g.cr_version,g.cr_aftviewver,g.cr_veryn,          \n");
				strQuery.append("       g.cr_acptno,a.cr_viewver,                         \n");
				strQuery.append("       b.cm_sysgb,b.cm_systype,                          \n");
				strQuery.append("       (select cm_codename from cmm0020                  \n");
				strQuery.append("         where cm_macode='CMR0020'                       \n");
				strQuery.append("           and cm_micode=a.cr_status) codename,          \n");
				strQuery.append("       (select cm_codename from cmm0020                  \n");
				strQuery.append("         where cm_macode='JAWON'                         \n");
				strQuery.append("           and cm_micode=a.cr_rsrccd) JAWON,             \n");
				strQuery.append("       (select cm_dirpath from cmm0070                   \n");
				strQuery.append("         where cm_syscd=a.cr_syscd                       \n");
				strQuery.append("           and cm_dsncd=a.cr_dsncd) cm_dirpath,          \n");
				strQuery.append("       (select cm_username from cmm0040                  \n");
				strQuery.append("         where cm_userid=a.cr_lstusr) cm_username        \n");
				strQuery.append("  from cmm0030 b,cmm0036 h,cmr0020 a,cmr1010 g,cmr1070 c \n");
				strQuery.append(" where c.cr_acptno=? 						   			  \n");
				strQuery.append("   and c.cr_baseitem=?               			          \n");
				strQuery.append("   and c.cr_acptno=g.cr_acptno        			          \n");
				strQuery.append("   and c.cr_itemid=g.cr_itemid        			          \n");
				strQuery.append("   and g.cr_itemid<>g.CR_BASEITEM             			  \n");
				strQuery.append("   and g.cr_status<>'3'                       			  \n");
				strQuery.append("   and g.cr_itemid=a.cr_itemid                			  \n");
			    strQuery.append("   and a.cr_status not in('9','C')              		  \n");
				strQuery.append("   and a.cr_syscd=h.cm_syscd            			      \n");
				strQuery.append("   and a.cr_rsrccd=h.cm_rsrccd 		           	      \n");
				strQuery.append("   and h.cm_syscd=b.cm_syscd  		           	          \n");
				//pstmt = conn.prepareStatement(strQuery.toString());
				pstmt = new LoggableStatement(conn,strQuery.toString());
				pstmt.setString(++cnt, fileList.get(i).get("cr_acptno"));
				pstmt.setString(++cnt, fileList.get(i).get("cr_itemid"));
				ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	            rs = pstmt.executeQuery();
				while (rs.next()){
	            	findSw = true;
	            	
					rst = new HashMap<String,String>();
					rst.put("ID", Integer.toString(rs.getRow()));
					if(rs.getString("cm_dirpath") != ""){
						rst.put("cm_dirpath",rs.getString("cm_dirpath"));
					}
					if(rs.getString("cr_rsrcname") != ""){
						rst.put("cr_rsrcname",rs.getString("cr_rsrcname"));
					}
					if(rs.getString("cr_story") != ""){
						rst.put("cr_story",rs.getString("cr_story"));
					}
					if(rs.getString("jawon") != ""){
						rst.put("jawon",rs.getString("jawon"));
					}
					rst.put("cr_befviewver",rs.getString("cr_aftviewver"));
					rst.put("cr_aftviewver",rs.getString("cr_befviewver"));
					rst.put("cr_befver",rs.getString("cr_version"));
					rst.put("cr_version",rs.getString("cr_befver"));
					rst.put("cr_aftver",rs.getString("cr_befver"));
					rst.put("cm_sysgb",rs.getString("cm_sysgb"));
					rst.put("cm_systype",rs.getString("cm_systype"));
					rst.put("cr_acptno",rs.getString("cr_acptno"));
					rst.put("selAcptno",fileList.get(i).get("cr_acptno"));
					rst.put("cr_lstver",rs.getString("cr_lstver"));
					rst.put("cm_username",rs.getString("cm_username"));
					if(rs.getString("cr_lastdate") != ""){
						rst.put("cr_lastdate",rs.getString("cr_lastdate"));
					}
					if(rs.getString("CodeName") != ""){
						rst.put("codename",rs.getString("CodeName"));
					}
					if(rs.getString("cr_syscd") != ""){
						rst.put("cr_syscd",rs.getString("cr_syscd"));
					}
					if(rs.getString("CR_RSRCCD") != ""){
						rst.put("cr_rsrccd",rs.getString("CR_RSRCCD"));
					}
					if(rs.getString("cr_dsncd") != ""){
						rst.put("cr_dsncd",rs.getString("cr_dsncd"));
					}
					if(rs.getString("cr_jobcd") != ""){
						rst.put("cr_jobcd",rs.getString("cr_jobcd"));
					}
					if(rs.getString("cr_status") != ""){
						rst.put("cr_status",rs.getString("cr_status"));
					}
					if(rs.getString("cm_info") != ""){
						rst.put("cm_info",rs.getString("cm_info"));
					}
					rst.put("prcseq", rs.getString("prcreq"));
					rst.put("cr_itemid", rs.getString("cr_itemid"));
					rst.put("baseitem", fileList.get(i).get("cr_itemid"));
					rst.put("ReqCD", rs.getString("CR_QRYCD"));


					rst.put("ersw","N");
					rst.put("ermsg","정상");
					rst.put("selected_flag", "0");
					strViewVer = rs.getString("cr_viewver").split("\\.");
					strAftViewVer = rs.getString("cr_aftviewver").split("\\.");
					if (!strViewVer[0].equals(strAftViewVer[0])) {
						rst.put("selected_flag", "1");
						rst.put("ermsg","최종기록아님");
						rst.put("ersw","Y");
					}

					strAftViewVer = rs.getString("cr_befviewver").split("\\.");
					if (Integer.parseInt(strAftViewVer[0])<1) {
						rst.put("selected_flag", "1");
						rst.put("ermsg","롤백대상없음");
						rst.put("ersw","Y");
					}
					if ("1".equals(rs.getString("cm_info").substring(11,12)) &&   //버전관리
						"0".equals(rs.getString("cm_info").substring(24,25)) &&   //빌드서버체크인
						"N".equals(rs.getString("cr_veryn"))) {                   //운영에서 컴파일안하는경우
						strQuery.setLength(0);
						strQuery.append("select count(*) cnt from cmr0025 \n");
						strQuery.append(" where cr_itemid=?               \n");
						strQuery.append("   and cr_ver=?                  \n");
						pstmt2 = conn.prepareStatement(strQuery.toString());
			//			pstmt2 = new LoggableStatement(conn,strQuery.toString());
						pstmt2.setString(1, rs.getString("cr_itemid"));
						pstmt2.setString(2, rs.getString("cr_befver"));
			//			//ecamsLogger.error(((LoggableStatement)pstmt2).getQueryString());
						rs2 = pstmt2.executeQuery();
						if (rs2.next()) {
							if (rs2.getInt("cnt")==0) {
								rst.put("ermsg", "버전파일없음");
								rst.put("selected_flag", "1");
								rst.put("ersw","Y");
							}
						}
						rs2.close();
						pstmt2.close();
					}

					if (rst.get("ersw").equals("Y")) {
						if (!rs.getString("cr_status").equals("0")) {
							rst.put("selected_flag","1");
						} else {
							rst.put("selected_flag","0");
						}
					}
					reqCnt = addCnt + 1;
					rst.put("seq", Integer.toString(reqCnt));
	    			rtList.add(addCnt++, rst);
	            	
	    			rst = null;
				}//end of while-loop statement
				rs.close();
				pstmt.close();

	            if (!findSw && (fileList.get(i).get("cm_info").substring(3,4).equals("1") ||   //동시적용모듈 
	            		        fileList.get(i).get("cm_info").substring(8,9).equals("1") ||   //실행모듈Check 
	            		        fileList.get(i).get("cm_info").substring(26,27).equals("1"))) { //개발툴연계
	            	rst = new HashMap<String,String>();
					rst = fileList.get(i);
					rst.put("ermsg","관련프로그램무");
					rst.put("selected_flag", "1");
					rtList.set(addCnt-1, rst);
					rst = null;
	            }
	            pstmt.close();
	            rs.close();
			}
			conn.close();
			conn = null;
			pstmt = null;
			rs = null;

			return rtList.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0800.getDownFileList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0800.getDownFileList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0800.getDownFileList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0800.getDownFileList() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rtList != null) rtList = null;
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (rs2 != null)     try{rs2.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0600.getDownFileList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}

	public String request_Check_In(ArrayList<HashMap<String,String>> chkInList,HashMap<String,String> etcData,ArrayList<HashMap<String,Object>> ConfList,String confFg,ArrayList<HashMap<String,String>> scriptList) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		int				  pstmtcount  = 1;
		AutoSeq			  autoseq	  = new AutoSeq();
		UserInfo		  userInfo	  = new UserInfo();
		String			  AcptNo	  = null;
		int				  i;
		boolean           findSw      = false;
		try {
			conn = connectionContext.getConnection();
			for (i=0;i<chkInList.size();i++){
        		if (chkInList.get(i).get("cr_itemid").equals(chkInList.get(i).get("baseitem"))) {
		        	strQuery.setLength(0);
		        	strQuery.append("select a.cr_status,a.cr_editor,b.cm_codename               \n");
		        	strQuery.append("  from cmr0020 a,cmm0020 b,cmm0030 c                       \n");
		        	strQuery.append(" where a.cr_itemid = ?                                     \n");
		        	strQuery.append("   and b.cm_macode='CMR0020' and b.cm_micode=a.cr_status   \n");
		        	strQuery.append("   and PGMSTACHK(?,'BEF',c.cm_systype,a.cr_status,a.cr_lstver,a.cr_viewver)<>'OK' \n");

		        	pstmt = conn.prepareStatement(strQuery.toString());
		        	pstmt.setString(1, chkInList.get(i).get("cr_itemid"));
		        	pstmt.setString(2, etcData.get("ReqCD"));
		        	rs = pstmt.executeQuery();
		        	if (rs.next()){
		        		AcptNo = "ERROR["+ chkInList.get(i).get("cr_rsrcname") + "]는 요청가능한 상태가 아닙니다. [" + rs.getString("cm_codename") +"]";			        		
		        	}
		        	rs.close();
		        	pstmt.close();
		        	if (AcptNo != null) break;
        		}
        	}

	        if (AcptNo != null) {
	        	if (conn != null) conn.close();
	        	return AcptNo;
	        }
	        
	        do {
		        AcptNo = autoseq.getSeqNo(conn,etcData.get("ReqCD"));

		        autoseq = null;
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

	        conn.setAutoCommit(false);

	        String strTeam = userInfo.getUserInfo_sub(conn,etcData.get("UserID"),"cm_project");
	        String strRequest = "";
	        strQuery.setLength(0);
	        strQuery.append("select cm_codename from cmm0020       \n");
	        strQuery.append(" where cm_macode='REQUEST'            \n");
	        strQuery.append("   and cm_micode=?                    \n");
	        pstmt = conn.prepareStatement(strQuery.toString());
	        pstmt.setString(1, etcData.get("ReqCD"));
	        rs = pstmt.executeQuery();
	        if (rs.next()) strRequest = rs.getString("cm_codename");
	        rs.close();
	        pstmt.close();
	        conn.setAutoCommit(false);

	        strQuery.setLength(0);
        	strQuery.append("insert into cmr1000 ");
        	strQuery.append("(CR_ACPTNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,CR_ACPTDATE,CR_STATUS,CR_TEAMCD,CR_QRYCD, \n");
        	strQuery.append("CR_PASSOK,CR_PASSCD,CR_EMGCD,CR_EDITOR,CR_SAYU,CR_PASSSUB,CR_SAYUCD,CR_VERSION,CR_SVRYN  \n");
        	strQuery.append(" ) values ( \n");
        	strQuery.append("?, ?, ?, ?, sysdate, '0', ?, ?, '2', ?, ?, ?, ? , ? , ?,'Y','Y' ) \n");
        	pstmt = conn.prepareStatement(strQuery.toString());
        	//pstmt = new LoggableStatement(conn,strQuery.toString());
        	pstmt.setString(pstmtcount++, AcptNo);
        	pstmt.setString(pstmtcount++, chkInList.get(0).get("cr_syscd"));
        	pstmt.setString(pstmtcount++, etcData.get("cm_sysgb"));
        	pstmt.setString(pstmtcount++, chkInList.get(0).get("cr_jobcd"));
        	pstmt.setString(pstmtcount++, strTeam);
        	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
        	pstmt.setString(pstmtcount++, strRequest);
        	pstmt.setString(pstmtcount++, etcData.get("ReqSayu"));
        	pstmt.setString(pstmtcount++, etcData.get("UserID"));
        	pstmt.setString(pstmtcount++, etcData.get("Sayu"));
        	pstmt.setString(pstmtcount++, etcData.get("EmgCd"));
        	pstmt.setString(pstmtcount++, etcData.get("PassCd"));
        	////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
        	pstmt.executeUpdate();

        	pstmt.close();
        	//String setParm = "N";
        	for (i=0;i<chkInList.size();i++){
        		//setParm = "N";
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
	            	strQuery.append("(CR_ACPTNO,CR_SERNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,  \n");
	            	strQuery.append(" CR_STATUS,CR_QRYCD,CR_RSRCCD,CR_DSNCD,          \n");
	            	strQuery.append(" CR_RSRCNAME,CR_RSRCNAM2,CR_SRCCHG,CR_SRCCMP,    \n");
	            	strQuery.append(" CR_PRIORITY,CR_VERSION,CR_CONFNO,CR_EDITOR,     \n");
	            	strQuery.append(" CR_BASENO,CR_BASEITEM,CR_ITEMID,                \n");
	            	strQuery.append(" CR_EDITCON,CR_COACPT,CR_BEFVER,CR_VERYN,        \n");
	            	strQuery.append(" CR_SVRYN,CR_BEFVIEWVER,CR_AFTVIEWVER,CR_SYSTYPE)\n");
	            	strQuery.append(" values              \n");
	            	strQuery.append("(?, ?, ?, ?, ?,      \n");
	            	strQuery.append(" '0', '04', ?, ?,    \n");
	            	strQuery.append(" ?, ?, '1','0',      \n");
	            	strQuery.append(" ?, ?, ?, ?,         \n");
	            	strQuery.append(" ?, ?, ?,            \n");
	            	strQuery.append(" ?, ?, ?, 'N',       \n");
	            	strQuery.append(" 'Y', ?, ?, ?)       \n");
	
	            	pstmtcount = 1;
	            	pstmt = conn.prepareStatement(strQuery.toString());
	            	//pstmt = new LoggableStatement(conn,strQuery.toString());
	
	            	pstmt.setString(pstmtcount++, AcptNo);
	            	pstmt.setInt(pstmtcount++, i + 1);
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_syscd"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cm_sysgb"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_jobcd"));
	
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_rsrccd"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_dsncd"));
	            	
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_rsrcname"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_rsrcname"));
	
	
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("prcseq"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_aftver"));
	        		pstmt.setString(pstmtcount++,chkInList.get(i).get("cr_acptno"));
	            	pstmt.setString(pstmtcount++, etcData.get("UserID"));
	            	
	            	
	        		pstmt.setString(pstmtcount++,chkInList.get(i).get("cr_acptno"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("baseitem"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_itemid"));
	            	
	            	
	            	if (chkInList.get(i).get("cr_sayu") != null && chkInList.get(i).get("cr_sayu") != "")
	            		pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_sayu"));
	            	else pstmt.setString(pstmtcount++, etcData.get("Sayu"));
	        		pstmt.setString(pstmtcount++, AcptNo);
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_befver"));
	            	
	            	
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_befviewver"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cr_aftviewver"));
	            	pstmt.setString(pstmtcount++, chkInList.get(i).get("cm_systype"));
	            	//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	            	pstmt.executeUpdate();
	            	pstmt.close();
	
	
	            	pstmtcount = 1;
	            	strQuery.setLength(0);
	            	strQuery.append("update cmr0020 set                           \n");
	            	strQuery.append("cr_status='J',                               \n");
	            	strQuery.append("cr_editor=?  				                  \n");
	            	strQuery.append("where cr_itemid=?                            \n");
	
	            	pstmt2 = conn.prepareStatement(strQuery.toString());
	            	pstmt2.setString(pstmtcount++, etcData.get("UserID"));
	            	pstmt2.setString(pstmtcount++, chkInList.get(i).get("cr_itemid"));
	
	            	pstmt2.executeUpdate();
	            	pstmt2.close();
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
        	String retMsg = cmr0200.request_Confirm(AcptNo, etcData.get("cm_syscd"), etcData.get("ReqCD"), etcData.get("UserID"), true, ConfList, conn);
        	//(AcptNo, etcData.get("ReqCD"), ConfList, conn);
        	if (!retMsg.equals("OK")) {
        		AcptNo = "ERROR결재정보등록에 실패하였습니다.";
        		conn.rollback();
        	} else {
            	conn.commit();
        	}
        	conn.close();

        	rs = null;
        	pstmt = null;
        	pstmt2 = null;
        	conn = null;
        	return AcptNo;

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmr0600.request_Check_In() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0600.request_Check_In() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmr0600.request_Check_In() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0600.request_Check_In() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0600.request_Check_In() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
}//end of Cmr0600 class statement
