package app.eCmr;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import org.apache.log4j.Logger;

import app.common.AutoSeq;
import app.common.LoggableStatement;
import app.common.UserInfo;

import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;

public class Cmr0101 {

	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();

	public Object[] getFileList(HashMap<String,String> etcData) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>		  rtList	  = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		ConnectionContext connectionContext = new ConnectionResource();
		int				  pstmtcount  = 1;

		try {

			conn = connectionContext.getConnection();

			UserInfo     userinfo = new UserInfo();
			boolean adminYn = userinfo.isAdmin_conn(etcData.get("UserID"),conn);
			userinfo = null;
			boolean srSw = false;
			
			if (etcData.get("srid") != null && !"".equals(etcData.get("srid")) ) srSw = true;

			strQuery.setLength(0);
			strQuery.append("select b.cr_rsrcname,b.cr_rsrccd,b.cr_jobcd,                   \n");
			strQuery.append("       b.cr_dsncd,b.cr_syscd,b.cr_itemid,b.cr_ckoutacpt,       \n");
			strQuery.append("       to_char(f.cr_acptdate,'yyyy/mm/dd hh24:mi') as acptdate,\n");
			strQuery.append("       b.cr_story,f.cr_acptno,f.cr_editor,                     \n");
			strQuery.append("       nvl(f.cr_eclipse,'R') eclipse,                          \n");
			strQuery.append("       d.cm_info,b.cr_status,b.cr_lstver,                      \n");
			strQuery.append("       nvl(b.cr_viewver,'0.0.0.0') cr_viewver,                 \n");
			strQuery.append("       (select cm_codename from cmm0020                        \n");
			strQuery.append("         where cm_macode='JAWON'                               \n");
			strQuery.append("           and cm_micode=b.cr_rsrccd) JAWON,                   \n");
			strQuery.append("       (select cm_dirpath from cmm0070                         \n");
			strQuery.append("         where cm_syscd=b.cr_syscd                             \n");
			strQuery.append("           and cm_dsncd=b.cr_dsncd) cm_dirpath,                \n");
			strQuery.append("       (select cm_jobname from cmm0102                         \n");
			strQuery.append("         where cm_jobcd=b.cr_jobcd) cm_jobname,                \n");
			strQuery.append("       (select cr_version from cmr1010                         \n");
			strQuery.append("         where cr_acptno=b.cr_ckoutacpt                        \n");
			strQuery.append("           and cr_itemid=b.cr_itemid) ckoutver,                \n");
			strQuery.append("       (select cr_aftviewver from cmr1010                      \n");
			strQuery.append("         where cr_acptno=b.cr_ckoutacpt                        \n");
			strQuery.append("           and cr_itemid=b.cr_itemid) ckoutviewver             \n");
			strQuery.append("  from cmr1000 f,cmr0020 b,cmr1010 a,cmm0036 d                 \n");
			strQuery.append(" where b.cr_syscd=?                                            \n");
			if (srSw) strQuery.append("and b.cr_isrid=?                                     \n");
			strQuery.append("   and b.cr_status in ('5','B','E','G')					    \n");
			if (!adminYn){
				strQuery.append("   and b.cr_lstusr=?                                       \n");
			}
			if (!"".equals(etcData.get("txtProg"))  && etcData.get("txtProg") != null){
				strQuery.append(" and (b.cr_rsrcname like ?	or b.cr_story like ?)	  		\n");
			}
			strQuery.append("   and decode(b.cr_status,'5',b.cr_ckoutacpt,'B',b.cr_acptno,'E',b.cr_devacpt,b.cr_testacpt)=f.cr_acptno \n");
			strQuery.append("   and f.cr_acptno=a.cr_acptno   					            \n");
			strQuery.append("   and b.cr_itemid=a.cr_itemid   							    \n");
			strQuery.append("   and a.cr_itemid=a.cr_baseitem                               \n");
			strQuery.append("   and a.cr_status<>'3' and a.cr_prcdate is not null           \n");
			strQuery.append("   and b.cr_syscd=d.cm_syscd and b.cr_rsrccd=d.cm_rsrccd       \n");
			strQuery.append(" order by acptdate desc,a.cr_rsrcname,a.cr_acptno desc         \n");

            //pstmt = conn.prepareStatement(strQuery.toString());
			pstmt =  new LoggableStatement(conn, strQuery.toString());
			pstmt.setString(pstmtcount++, etcData.get("syscd"));
			if (srSw) pstmt.setString(pstmtcount++, etcData.get("srid"));
			if (!adminYn){
				pstmt.setString(pstmtcount++, etcData.get("UserID"));
			}
			if (!"".equals(etcData.get("txtProg"))  && etcData.get("txtProg") != null){
				pstmt.setString(pstmtcount++, "%"+etcData.get("txtProg")+"%");
				pstmt.setString(pstmtcount++, "%"+etcData.get("txtProg")+"%");
			}
			ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            rs = pstmt.executeQuery();

            rtList.clear();
			while (rs.next()){
				rst = new HashMap<String,String>();
				rst.put("cr_acptno", rs.getString("cr_acptno"));
				rst.put("acptno", rs.getString("cr_acptno").substring(0,4)+"-"+rs.getString("cr_acptno").substring(4,6)+"-"+rs.getString("cr_acptno").substring(6));
				rst.put("acptdate",rs.getString("acptdate"));
				rst.put("cm_dirpath",rs.getString("cm_dirpath"));
				rst.put("cr_rsrcname",rs.getString("cr_rsrcname"));
				rst.put("jawon",rs.getString("jawon"));
				rst.put("sysgb",etcData.get("sysgb"));
				rst.put("cr_rsrccd",rs.getString("cr_rsrccd"));
				rst.put("cr_jobcd",rs.getString("cr_jobcd"));
				rst.put("cr_dsncd",rs.getString("cr_dsncd"));
				rst.put("cr_syscd",rs.getString("cr_syscd"));
				rst.put("cr_itemid",rs.getString("cr_itemid"));
				rst.put("cm_info",rs.getString("cm_info"));
				rst.put("cm_jobname",rs.getString("cm_jobname"));
				rst.put("cr_editor",rs.getString("cr_editor"));
				rst.put("cr_status",rs.getString("cr_status"));
				rst.put("baseitemid",rs.getString("cr_itemid"));
				rst.put("cr_lstver",rs.getString("cr_lstver"));
				rst.put("cr_viewver",rs.getString("cr_viewver"));
				rst.put("eclipse",rs.getString("eclipse"));
				rst.put("cr_status",rs.getString("cr_status"));
				rst.put("selected_flag","0");
				rst.put("cr_story",rs.getString("cr_Story"));
				if (rs.getString("cr_ckoutacpt") != null) {
					rst.put("cr_baseno",rs.getString("cr_ckoutacpt"));
					rst.put("ckoutver", rs.getString("ckoutver"));
					rst.put("ckoutviewver",rs.getString("ckoutviewver"));
				} else {
					rst.put("cr_baseno", "");
					rst.put("ckoutver", "");
					rst.put("ckoutviewver","");
				}
				rtList.add(rst);
				rst = null;
			}//end of while-loop statement

			rs.close();
			pstmt.close();
			conn.close();

			rs = null;
			pstmt = null;
			conn = null;

			etcData.clear();
			etcData = null;

			return rtList.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0101.getFileList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0101.getFileList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0101.getFileList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0101.getFileList() Exception END ##");
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
					ecamsLogger.error("## Cmr0101.getFileList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}

	public Object[] getDownFileList(ArrayList<HashMap<String,String>> fileList) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ArrayList<HashMap<String, String>>		  rtList	  = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		ConnectionContext connectionContext = new ConnectionResource();

		try {

			conn = connectionContext.getConnection();

			for (int i=0;i<fileList.size();i++){
				rst = new HashMap<String,String>();
				rst.put("cm_dirpath",fileList.get(i).get("cm_dirpath"));
				rst.put("cr_rsrcname",fileList.get(i).get("cr_rsrcname"));
				rst.put("cm_jobname", fileList.get(i).get("cm_jobname"));
				rst.put("jawon", fileList.get(i).get("jawon"));
				rst.put("sysgb", fileList.get(i).get("sysgb"));
				rst.put("cr_rsrccd",fileList.get(i).get("cr_rsrccd"));
				rst.put("cr_dsncd",fileList.get(i).get("cr_dsncd"));
				rst.put("cr_jobcd",fileList.get(i).get("cr_jobcd"));
				rst.put("cr_syscd", fileList.get(i).get("cr_syscd"));
				rst.put("acptno", fileList.get(i).get("acptno"));
				rst.put("cr_acptno", fileList.get(i).get("cr_acptno"));
				rst.put("cr_itemid",fileList.get(i).get("cr_itemid"));
				rst.put("baseitemid",fileList.get(i).get("cr_itemid"));
				rst.put("cm_info",fileList.get(i).get("cm_info"));
				rst.put("cr_editor",fileList.get(i).get("cr_editor"));
				rst.put("cr_status",fileList.get(i).get("cr_status"));
				rst.put("cr_lstver",fileList.get(i).get("cr_lstver"));
				rst.put("cr_story",fileList.get(i).get("cr_story"));
				rst.put("cr_status",fileList.get(i).get("cr_status"));
				rst.put("cr_baseno",fileList.get(i).get("cr_baseno"));
				rst.put("ckoutver",fileList.get(i).get("ckoutver"));
				rst.put("eclipse",fileList.get(i).get("eclipse"));
				rst.put("ckoutviewver",fileList.get(i).get("ckoutviewver"));
				rtList.add(rst);
				rst = null;

				strQuery.setLength(0);
				strQuery.append("select a.cr_rsrcname,a.cr_rsrccd,a.cr_jobcd,           \n");
				strQuery.append("       a.cr_dsncd,a.cr_syscd,a.cr_itemid,              \n");
				strQuery.append("       a.cr_lstver,a.cr_story,a.cr_ckoutacpt,          \n");
				strQuery.append("       nvl(a.cr_viewver,'0.0.0.0') cr_viewver,         \n");
				strQuery.append("       b.cr_editor,e.cm_info,                          \n");
				strQuery.append("       (select cm_codename from cmm0020                \n");
				strQuery.append("         where cm_macode='JAWON'                       \n");
				strQuery.append("           and cm_micode=b.cr_rsrccd) JAWON,           \n");
				strQuery.append("       (select cm_dirpath from cmm0070                 \n");
				strQuery.append("         where cm_syscd=b.cr_syscd                     \n");
				strQuery.append("           and cm_dsncd=b.cr_dsncd) cm_dirpath,        \n");
				strQuery.append("       (select cm_jobname from cmm0102                 \n");
				strQuery.append("         where cm_jobcd=b.cr_jobcd) cm_jobname,        \n");
				strQuery.append("       (select cr_version from cmr1010                 \n");
				strQuery.append("         where cr_acptno=a.cr_ckoutacpt                \n");
				strQuery.append("           and cr_itemid=a.cr_itemid) ckoutver,        \n");
				strQuery.append("       (select cr_aftviewver from cmr1010              \n");
				strQuery.append("         where cr_acptno=a.cr_ckoutacpt                \n");
				strQuery.append("           and cr_itemid=a.cr_itemid) ckoutviewver     \n");
				strQuery.append("  from cmr0020 a,cmr1010 b,cmm0036 e                   \n");
				strQuery.append(" where b.cr_acptno= ?                                  \n");
				strQuery.append("   and b.cr_status<>'3'                                \n");
				strQuery.append("   and b.cr_baseitem=?                                 \n");
				strQuery.append("   and b.cr_itemid<>b.cr_baseitem                      \n");
				strQuery.append("   and b.cr_itemid=a.cr_itemid                         \n");
				strQuery.append("   and a.cr_syscd=e.cm_syscd                           \n");
				strQuery.append("   and a.cr_rsrccd=e.cm_rsrccd                         \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt =  new LoggableStatement(conn, strQuery.toString());
	            pstmt.setString(1, fileList.get(i).get("cr_acptno"));
	            pstmt.setString(2, fileList.get(i).get("cr_itemid"));
	            ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	            rs = pstmt.executeQuery();
				while (rs.next()){
					rst = new HashMap<String,String>();
					rst.put("cm_dirpath",rs.getString("cm_dirpath"));
					rst.put("cr_rsrcname",rs.getString("cr_rsrcname"));
					rst.put("cm_jobname", rs.getString("cm_jobname"));
					rst.put("jawon", rs.getString("jawon"));
					rst.put("sysgb", fileList.get(i).get("sysgb"));
					rst.put("cr_rsrccd",rs.getString("cr_rsrccd"));
					rst.put("cr_dsncd",rs.getString("cr_dsncd"));
					rst.put("cr_jobcd",rs.getString("cr_jobcd"));
					rst.put("cr_syscd", fileList.get(i).get("cr_syscd"));
					rst.put("cr_itemid",rs.getString("cr_itemid"));
					rst.put("acptno", fileList.get(i).get("acptno"));
					rst.put("cr_acptno", fileList.get(i).get("cr_acptno"));
					rst.put("baseitemid",fileList.get(i).get("cr_itemid"));
					rst.put("cm_info",rs.getString("cm_info"));
					rst.put("cr_editor",rs.getString("cr_editor"));
					rst.put("cr_lstver",rs.getString("cr_lstver"));
					rst.put("cr_story",rs.getString("cr_story"));
					rst.put("eclipse",fileList.get(i).get("eclipse"));
					if (rs.getString("cr_ckoutacpt") != null) {
						rst.put("cr_baseno",rs.getString("cr_ckoutacpt"));
						rst.put("ckoutver", rs.getString("ckoutver"));
						rst.put("ckoutviewver",rs.getString("ckoutviewver"));
					} else {
						rst.put("cr_baseno", "");
						rst.put("ckoutver", "");
						rst.put("ckoutviewver","");
					}
					rtList.add(rst);
					rst = null;
				}//end of while-loop statement
				rs.close();
				pstmt.close();
			}
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			fileList.clear();
			fileList = null;

			return rtList.toArray();


		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr0101.getDownFileList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0101.getDownFileList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr0101.getDownFileList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0101.getDownFileList() Exception END ##");
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
					ecamsLogger.error("## Cmr0101.getDownFileList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}

	public String request_Check_Out_Cancel(ArrayList<HashMap<String,String>> chkOutList,HashMap<String,String> etcData,ArrayList<HashMap<String,Object>> ConfList) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		int				  pstmtcount  = 1;
		AutoSeq			  autoseq	  = new AutoSeq();
		String			  AcptNo	  = null;
		int				  i;

		try {
			conn = connectionContext.getConnection();

			conn.setAutoCommit(false);

	        for (i=0;i<chkOutList.size();i++){
	        	if (chkOutList.get(i).get("cr_itemid").equals(chkOutList.get(i).get("baseitemid"))) {
		        	strQuery.setLength(0);
		        	strQuery.append("select cr_rsrcname from cmr0020 \n");
		        	strQuery.append("where cr_itemid = ? \n");
		        	strQuery.append("and cr_status<>?    \n");

		        	pstmt = conn.prepareStatement(strQuery.toString());

		        	pstmt.setString(1, chkOutList.get(i).get("cr_itemid"));
		        	pstmt.setString(2, chkOutList.get(i).get("cr_status"));

		        	rs = pstmt.executeQuery();

		        	while (rs.next()){
		        		AcptNo = rs.getString("cr_rsrcname")+" 파일은 이미 취소가 됐거나 취소가능상태가 아닙니다. ";
		        		break;
		        	}
		        	rs.close();
		        	pstmt.close();
	        	}
	        }
	        if (AcptNo != null) {
	        	rs = null;
	        	pstmt = null;
	        	conn.close();
	        	return AcptNo;
	        }
	        AcptNo = autoseq.getSeqNo(conn,etcData.get("ReqCD"));

	        autoseq = null;

	        strQuery.setLength(0);

	        strQuery.append("select count(*) as acptnocnt from cmr1000 \n");
        	strQuery.append("where cr_acptno= ? \n");
        	pstmt = conn.prepareStatement(strQuery.toString());
        	pstmt.setString(1, AcptNo);
        	rs = pstmt.executeQuery();
        	if (rs.next()){
        		i = rs.getInt("acptnocnt");
        	}
        	rs.close();
        	pstmt.close();
        	
        	if (i>0){
	        	rs = null;
	        	pstmt = null;
	        	conn.close();
        		return "["+ AcptNo +"]동일한 일련번호로 신청건이 있습니다.";
        	}

        	

            strQuery.setLength(0);
        	strQuery.append("insert into cmr1000 ");
        	strQuery.append("(CR_ACPTNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,CR_ACPTDATE,\n");
        	strQuery.append(" CR_STATUS,CR_TEAMCD,CR_QRYCD,CR_PASSOK,          \n");
        	strQuery.append(" CR_PASSCD,CR_EDITOR,CR_ITSMID,CR_ITSMTITLE,CR_ECLIPSE) \n");
        	strQuery.append("(select ?, ?, ?, ?, sysdate, '0', cm_project,     \n");
        	strQuery.append("        ?, '0', ?, cm_userid, ?,?, ?              \n");
        	strQuery.append("   from cmm0040                                   \n");
        	strQuery.append("  where cm_userid=?)                              \n");

        	pstmt = conn.prepareStatement(strQuery.toString());
        	pstmt.setString(pstmtcount++, AcptNo);
        	pstmt.setString(pstmtcount++, chkOutList.get(0).get("cr_syscd"));
        	pstmt.setString(pstmtcount++, chkOutList.get(0).get("sysgb"));
        	pstmt.setString(pstmtcount++, chkOutList.get(0).get("cr_jobcd"));
        	pstmt.setString(pstmtcount++, etcData.get("ReqCD"));
        	pstmt.setString(pstmtcount++, etcData.get("sayu"));
        	pstmt.setString(pstmtcount++, etcData.get("srid"));
        	pstmt.setString(pstmtcount++, etcData.get("cc_reqtitle"));
        	pstmt.setString(pstmtcount++, etcData.get("eclipse"));
        	pstmt.setString(pstmtcount++, etcData.get("UserID"));
        	pstmt.executeUpdate();
        	pstmt.close();


        	for (i=0;i<chkOutList.size();i++){
            	strQuery.setLength(0);
            	strQuery.append("insert into cmr1010 ");
            	strQuery.append("(CR_ACPTNO,CR_SERNO,CR_SYSCD,CR_SYSGB,CR_JOBCD,CR_STATUS,CR_QRYCD, \n");
            	strQuery.append("CR_RSRCCD,CR_DSNCD,CR_RSRCNAME,CR_RSRCNAM2,CR_VERSION,             \n");
            	strQuery.append("CR_EDITOR,CR_CONFNO,CR_EDITCON,CR_BASENO,CR_BASEITEM,CR_ITEMID,    \n");
            	strQuery.append("CR_STORY,CR_AFTVIEWVER)                                            \n");
            	strQuery.append(" values \n");
            	strQuery.append("(?,?,?,?,?,'0','11',   ?,?,?,?,?,   ?,?,?,?,?,?,   ?,?)            \n");

            	pstmt = conn.prepareStatement(strQuery.toString());
            	pstmt = new LoggableStatement(conn, strQuery.toString());
            	pstmtcount = 1;
            	pstmt.setString(pstmtcount++, AcptNo);
            	pstmt.setInt(pstmtcount++, i+1);
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_syscd"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("sysgb"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_jobcd"));


            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_rsrccd"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_dsncd"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_rsrcname"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_rsrcname"));
            	if (chkOutList.get(i).get("chkoutver") != null && !"".equals(chkOutList.get(i).get("chkoutver"))) {
            		pstmt.setString(pstmtcount++, chkOutList.get(i).get("chkoutver"));
            	} else {
            		pstmt.setString(pstmtcount++, "0");
            	}
            	pstmt.setString(pstmtcount++, etcData.get("UserID"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_acptno"));
            	pstmt.setString(pstmtcount++, etcData.get("sayu"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_baseno"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("baseitemid"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_itemid"));
            	
            	
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_story"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("ckoutviewver"));
            	ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
            	pstmt.executeUpdate();
            	pstmt.close();

            	strQuery.setLength(0);
            	strQuery.append("update cmr0020                    \n");
            	strQuery.append("   set cr_savesta=cr_status,      \n");
            	strQuery.append("       cr_status='6',             \n");
            	strQuery.append("       cr_editor=?,               \n");
            	strQuery.append("       cr_lastdate=SYSDATE        \n");
            	strQuery.append(" where cr_itemid=?                \n");
            	pstmt = conn.prepareStatement(strQuery.toString());
            	pstmtcount = 1;
            	pstmt.setString(pstmtcount++, etcData.get("UserID"));
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_itemid"));
            	pstmt.executeUpdate();
            	pstmt.close();


            	strQuery.setLength(0);
            	strQuery.append("update cmr1010 set cr_confno=?  \n");
            	strQuery.append(" where cr_itemid= ?             \n");
            	strQuery.append("   and substr(cr_acptno,5,2) in ('01','02','03','07','08') \n");
            	strQuery.append("   and cr_confno is null        \n");
            	//테스트적용취소 일때 테스트적용 신청 건만 confno 셋팅
            	pstmt = conn.prepareStatement(strQuery.toString());
            	pstmtcount = 1;
            	pstmt.setString(pstmtcount++, AcptNo);
            	pstmt.setString(pstmtcount++, chkOutList.get(i).get("cr_itemid"));
            	pstmt.executeUpdate();
            	pstmt.close();

        	}

        	Cmr0200 cmr0200 = new Cmr0200();
        	String retMsg = cmr0200.request_Confirm(AcptNo,etcData.get("syscd"),etcData.get("ReqCD"),etcData.get("UserID"),true,ConfList,conn);
        	cmr0200 = null;
        	if (!retMsg.equals("OK")) {
				conn.rollback();
				conn.close();
				throw new Exception("결재정보등록 중 오류가 발생하였습니다. 관리자에게 연락하여 주시기 바랍니다.");
			}


        	conn.commit();
			conn.close();

			rs = null;
			pstmt = null;
			conn = null;

        	chkOutList.clear();
        	chkOutList = null;
        	etcData.clear();
        	etcData = null;

        	return AcptNo;

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					conn.close();
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0101.request_Check_Out_Cancel() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmr0101.request_Check_Out_Cancel() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr0101.request_Check_Out_Cancel() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.rollback();
					conn.close();
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0101.request_Check_Out_Cancel() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			ecamsLogger.error("## Cmr0101.request_Check_Out_Cancel() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr0101.request_Check_Out_Cancel() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr0101.request_Check_Out_Cancel() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}

}
