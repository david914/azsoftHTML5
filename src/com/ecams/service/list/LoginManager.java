/*****************************************************************************************
	1. program ID	: LoginManager.java
	2. create date	: 2008.10
	3. auth		    : No name
	4. update date	: 
	5. auth		    : 
	6. description	: �α��� �Ŵ���
*****************************************************************************************/

package com.ecams.service.list;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionBindingListener;
import javax.servlet.http.HttpSessionBindingEvent;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Hashtable;
import java.util.Enumeration;

import org.apache.log4j.Logger;
import com.ecams.common.base.Encryptor;
import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;


public class LoginManager implements HttpSessionBindingListener
{
	
	private static LoginManager loginManager = null;
	private static Hashtable loginUsers = new Hashtable();
	
	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
	
	private LoginManager()
	{
		super();
	}
	
	public static synchronized LoginManager getInstance(){
		if(loginManager == null){
			loginManager = new LoginManager();
		}
		return loginManager;
	}
	
	//���̵� �´��� üũ
	public String isValid(String UserId, String usr_passwd) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs          = null;
		ResultSet		  rs2		  = null;
		StringBuffer      strQuery    = new StringBuffer();
		int               CNT2        = 0;
		int               PwdCd       = 0;
		int               PwdCnt      = 0;
		int               PwdTerm     = 0;
		int               PwdSave     = 0;
		String            eCAMSPwd     = "ecams123";
		String            testPwd     = "ecams123";
		int               retCnt	  = 3;
		boolean           passOk      = false;
		String            strUserId   = "";
		
		ConnectionContext connectionContext = new ConnectionResource();
		
		Encryptor oEncryptor = Encryptor.instance();
		//String strEnPassWd = oEncryptor.strGetEncrypt(usr_passwd);
		//String strEnPassWd = usr_passwd;
		
		try {
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
   		    strQuery.append("SELECT CM_PWDCD,CM_PWDCNT,CM_PWDTERM,CM_PASSWD,CM_TSTPWD  \n");
   		    strQuery.append("  FROM CMM0010                                            \n");
   		    strQuery.append(" WHERE CM_STNO='ECAMS'                                    \n");
			pstmt = conn.prepareStatement(strQuery.toString());
			rs = pstmt.executeQuery();
			if (rs.next()){
			   PwdCd = Integer.parseInt(rs.getString("CM_PWDCD"));
			   PwdCnt = rs.getInt("CM_PWDCNT");	
			   PwdTerm = rs.getInt("CM_PWDTERM");
			   eCAMSPwd = rs.getString("CM_PASSWD");
			   testPwd = rs.getString("CM_TSTPWD");
			   if (PwdCd == 1) PwdSave = PwdCd;
			   else if (PwdCd == 2) PwdSave = PwdTerm * 7;
			   else if (PwdCd == 3) PwdSave = PwdTerm * 30;
			   else if (PwdCd == 4) PwdSave = PwdTerm * 120;
			   else if (PwdCd == 5) PwdSave = PwdTerm * 182;
			   else if (PwdCd == 6) PwdSave = PwdTerm * 365;			   
			}
			rs.close();
			pstmt.close();
			rs = null;
			pstmt = null;
			
			if (usr_passwd.equals("SSO")) usr_passwd = eCAMSPwd;
			if (usr_passwd.equals(eCAMSPwd)) passOk = true;//�Էº���� ecamshnb �϶�
			if (usr_passwd.equals(testPwd)) {//�Էº���� scmhnb �϶�
				strQuery.setLength(0);
				strQuery.append("select count(*) cnt from cmm0044 a,cmm0030 b    \n");
				strQuery.append(" where substr(a.cm_userid,2)=?                  \n");
				strQuery.append("   and a.cm_syscd=b.cm_syscd                    \n");
				strQuery.append("   and substr(b.cm_sysinfo,4,1)='1'             \n");
				pstmt = conn.prepareStatement(strQuery.toString());	
	            pstmt.setString(1, UserId);
	            rs = pstmt.executeQuery();
				if (rs.next()){
					if (rs.getInt("cnt") > 0) passOk = true; 
				}
				//ecamsLogger.debug("++++++retCnt+++"+Integer.toString(retCnt));
				rs.close();
				pstmt.close();
				rs = null;
				pstmt = null;
			}
			//ecamsLogger.debug("++++++retCnt2+++"+Integer.toString(retCnt));
			strQuery.setLength(0);
   		    strQuery.append("SELECT CM_USERID,CM_ADMIN,CM_JUMINNUM,CM_DUMYPW,CM_ACTIVE,CM_ERCOUNT,CM_CPASSWD,trunc(SYSDATE - CM_CHANGEDT,0) DayCnt ");
   		    strQuery.append("FROM CMM0040 ");
   		    strQuery.append("WHERE cm_userid= ? ");
			pstmt = conn.prepareStatement(strQuery.toString());	
            pstmt.setString(1, UserId);
            rs = pstmt.executeQuery();
            
			if (rs.next()){
				//ecamsLogger.error(rs.getString("CM_CPASSWD"));
				++CNT2;
				strUserId = rs.getString("CM_USERID");
				if (!rs.getString("CM_ACTIVE").equals("1")) retCnt = 1;//cm_active == 0 �϶�
				else if (passOk) retCnt = 0;//������Ű(ecamshnb) �Ǵ� scmhnb �� �Է������� �������� �α���
				else if (rs.getString("CM_JUMINNUM") == null) retCnt = 5;//�ֹι�ȣ�� ������
				//else if (rs.getInt("CM_ERCOUNT") >= PwdCnt) retCnt = 2;//����ī��Ʈ �ʰ�������
				//else if (rs.getInt("DayCnt") > PwdSave) retCnt = 6;//������� �ֱⰡ �ʰ�������
				else if (rs.getString("CM_CPASSWD") != null) {
					//if (!rs.getString("CM_CPASSWD").equals(strEnPassWd)) {
					Boolean pwdChk = false;
					if (rs.getInt("CM_ERCOUNT") >= PwdCnt) {//����ī��Ʈ �ʰ�������
						String login_limit="";
						strQuery.setLength(0);
						strQuery.append("SELECT CASE \n");
						strQuery.append("WHEN CM_LOGINDT+30/1440 < SYSDATE THEN 'NO_LIMIT' \n");
						strQuery.append("WHEN CM_LOGINDT+30/1440 >= SYSDATE THEN 'LIMIT' \n");
						strQuery.append("END CM_LOGINDT \n");
						strQuery.append("FROM CMM0040 WHERE CM_USERID=? ");
						pstmt2 = conn.prepareStatement(strQuery.toString());	
						pstmt2.setString(1, UserId);	
						rs2 = pstmt2.executeQuery();
						if (rs2.next()){
						 login_limit = rs2.getString("CM_LOGINDT");
						}
						rs2.close();
						pstmt2.close();
					 	if( login_limit.equals("LIMIT") ){
					 		retCnt = 2; //30�� ���� �α��� ����
					 	} else {
					 		pwdChk=true;
					 	}
					} else {
						pwdChk=true;
					}
	
					if( pwdChk ){
						if (!rs.getString("CM_CPASSWD").equals(oEncryptor.SHA256(usr_passwd))) {
							strQuery.setLength(0);
							if( rs.getInt("CM_ERCOUNT") == PwdCnt ){
								strQuery.append("UPDATE CMM0040 SET CM_ERCOUNT=1, CM_LOGINDT=SYSDATE ");
							} else {
								strQuery.append("UPDATE CMM0040 SET CM_ERCOUNT=CM_ERCOUNT+1, CM_LOGINDT=SYSDATE ");
							}
							strQuery.append("WHERE cm_userid = ? ");
							pstmt2 = conn.prepareStatement(strQuery.toString());	
							pstmt2.setString(1, UserId);	
							pstmt2.executeUpdate();
							pstmt2.close();
							pstmt2 = null;
							retCnt = 4;//����� ����� �Է� ����� Ʋ����
						} else {
							retCnt = 8;//����� ����� �Է� ����� ��ġ �� ��
							if (rs.getInt("DayCnt") > PwdSave) retCnt = 6;//������� �ֱⰡ �ʰ�������
						}
					}
				}
				//else if (rs.getString("CM_JUMINNUM") == null && rs.getString("CM_CPASSWD") == null) retCnt = 3;//�ֹι�ȣ�� ����Ⱥ���� null �϶�
				else if (rs.getString("CM_CPASSWD") == null) {//����Ⱥ���� null �϶�
					if (rs.getString("CM_JUMINNUM").equals(usr_passwd)) {
						retCnt = 3;
					}else {
						strQuery.setLength(0);
			   		    strQuery.append("UPDATE CMM0040 SET CM_ERCOUNT=CM_ERCOUNT+1, CM_LOGINDT=SYSDATE ");
			   		    strQuery.append("WHERE cm_userid = ? ");
			   		    pstmt2 = conn.prepareStatement(strQuery.toString());	
			            pstmt2.setString(1, UserId);
			            pstmt2.executeUpdate();
			            pstmt2.close();
			            pstmt2 = null;
			            retCnt = 4;//����ʱ�ȭ �� �Է��� ����� �ֹι�ȣ�� Ʋ����
					}
				}
				
				if (retCnt == 8){//����� ����� �Է� ����� ��ġ �� ��
					strQuery.setLength(0);
		   		    strQuery.append("UPDATE CMM0040 SET CM_ERCOUNT=0, CM_LOGINDT=SYSDATE ");
		   		    strQuery.append("WHERE cm_userid = ? ");
		   		    pstmt2 = conn.prepareStatement(strQuery.toString());	
		            pstmt2.setString(1, UserId);	
		            pstmt2.executeUpdate();
		            pstmt2.close();
		            pstmt2 = null;
		            retCnt = 0;//�������� �α���
				}
				  
				//�����ڷα����ϸ� OCX ���� �ٿ� �������� �̵��ϰ� �Ϸ��� ������ 
				//�����ڸ޴����� FLEX�� ���鼭 �ʿ� ������ �׷��� �ּ�ó��
				/*
				if (retCnt == 0 && rs.getString("CM_ADMIN").equals("1")){
					retCnt = 9;//��������ý��� �����ڰ� �������� �α��� �� ��
				}
				*/
			}else{
				retCnt = 7;//DB�� �����������  ������
			}
			rs.close();
			pstmt.close();
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			//ecamsLogger.debug("++++++retCnt3+++"+Integer.toString(retCnt));
			return Integer.toString(retCnt) + strUserId;
			//if(CNT2 < 1) return 9;
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## LoginManager.isValid() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## LoginManager.isValid() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## LoginManager.isValid() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## LoginManager.isValid() Exception END ##");				
			throw exception;
		}finally{
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (pstmt2 != null)  try{pstmt2.close();}catch (Exception ex3){ex3.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## LoginManager.isValid() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}
	
	
	//�ش� ID�� �̸���������
	public String getUserName(String UserId) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();
			strQuery.append("SELECT CM_USERNAME FROM CMM0040 ");
			strQuery.append(" WHERE CM_USERID = ? ");
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, UserId);
            rs = pstmt.executeQuery();
            
            String UserName = "";
			if (rs.next()){
				UserName = rs.getString("CM_USERNAME");
			}
			rs.close();
			pstmt.close();
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			
			return UserName;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			throw exception;
		}finally{
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
	}
	
	//�ش� ���ǿ� �̹� �α��� ���ִ��� üũ
	public boolean isLogin(String sessionID){
		boolean isLogin = false;
		Enumeration e = loginUsers.keys();
		String key = "";
		while(e.hasMoreElements()){
			key = (String)e.nextElement();
            if(sessionID.equals(key)){
            	isLogin = true;
            }
		}
		return isLogin;
	}
	
	//�ߺ� �α��� ���� ���� ���̵� ��������� üũ
	public boolean isUsing(String UserId){
		boolean isUsing = false;
		Enumeration e = loginUsers.keys();
		String key = "";
		while(e.hasMoreElements()){
			key = (String)e.nextElement();
			if(UserId.equals(loginUsers.get(key))){
				
			    Connection 			conn 		= null;
				PreparedStatement 	pstmt       = null;
				ResultSet         	rs          = null;
				StringBuffer      	strQuery    = new StringBuffer();
				ConnectionContext connectionContext = null;
				
				try {
					connectionContext = new ConnectionResource();
				} catch (Exception ex) {
					// TODO Auto-generated catch block
					ex.printStackTrace();
				}
				
				try { 
				    conn = connectionContext.getConnection();
					strQuery.append("SELECT CM_STATUS FROM CMM0040 ");
					strQuery.append(" WHERE CM_USERID = ? ");
					pstmt = conn.prepareStatement(strQuery.toString());	
		            pstmt.setString(1, UserId);
		            rs = pstmt.executeQuery();
					if (rs.next()){
						if (rs.getString("CM_STATUS").equals("0")){
							loginUsers.remove(key);
						}else{
							isUsing = true;
						}
					}
					rs.close();
					pstmt.close();
					conn.close();
					
					rs = null;
					pstmt = null;
		            strQuery = null;
		            
				} catch (SQLException sqlexception) {
					sqlexception.printStackTrace();
					connectionContext = null;
					rs = null;
					pstmt = null;
					conn = null;
				} catch (Exception exception) {
					exception.printStackTrace();
					connectionContext = null;
					rs = null;
					pstmt = null;
					conn = null;
				}finally{
					if (rs != null)		rs = null;
					if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
					if (conn != null){	try{ConnectionResource.release(conn);}catch(Exception ex3){ex3.printStackTrace();}}
				}
				
			}
		}
		return isUsing;
	}
	
	//���� ����
	public void setSession(HttpSession session, String UserId){
		loginUsers.put(session.getId(), UserId);
	    session.setAttribute("login", this.getInstance());
	}
	
	//����ã��
	public boolean getSession(String UserId)
	{
		Enumeration e = loginUsers.keys();
		String key = "";
		boolean isId = false;
		while( e.hasMoreElements() ){
			key = (String)e.nextElement();
			
			if( UserId.equals(loginUsers.get(key)) ){
				isId = true;
				break;
			}
		}
		
		e = null;
		
//		if(!isId){
//			loginUsers.remove(key);
//		}
		
		return isId;
	}
	
	//���� �ٽ� ����
	public void resetSession(HttpSession session,String UserId)
	{
		Enumeration e = loginUsers.keys();
		String key = "";
		while(e.hasMoreElements()){
			key = (String)e.nextElement();
			if(UserId.equals(loginUsers.get(key))){
				loginUsers.remove(key);
			}
		}
		loginUsers.put(session.getId(), UserId);
	    session.setAttribute("login", this.getInstance());
	}

	//���� ����
	public void delSession(HttpSession session,String UserId){
		Enumeration e = loginUsers.keys();
		String key = "";
		while(e.hasMoreElements()){
			key = (String)e.nextElement();
			if(UserId.equals(loginUsers.get(key))){
				loginUsers.remove(key);
			}
		}
	}
	
	//�ش� ���� ����
	public void removeSession( HttpSession session ) {
		loginUsers.remove(session.getId());
	}
	
	//���� ������ ��
	public void valueBound(HttpSessionBindingEvent event){		
		String UserId = (String)loginUsers.get(event.getSession().getId());		
		
		System.out.println("sessionID Bound : "+UserId);		
	}
	
	//���� ���涧
	public void valueUnbound(HttpSessionBindingEvent event){
		
	    Connection 			conn 		= null;
		PreparedStatement 	pstmt       = null;
		StringBuffer      	strQuery    = new StringBuffer();
		ConnectionContext connectionContext = null;
		
		try {
			connectionContext = new ConnectionResource();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		String UserId = (String)loginUsers.get(event.getSession().getId());
		
		Enumeration e = loginUsers.keys();
		String key = "";
		while(e.hasMoreElements()){
			key = (String)e.nextElement();
			if(UserId.equals(loginUsers.get(key))){
				loginUsers.remove(key);
			}
		}
		
		System.out.println("sessionID UnBound 1111111111111  : "+UserId);
		
		try { 
		    conn = connectionContext.getConnection();
		    strQuery.setLength(0);
			strQuery.append("UPDATE CMM0040 set CM_STATUS = '0', CM_LOGOUTDT = sysdate   \n");
			strQuery.append("                  WHERE CM_USERID = ?   					\n");
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, UserId);
            pstmt.executeUpdate();
            strQuery = null;
            pstmt.close();
            
            conn.close();
            
            pstmt = null;
            conn = null;
            
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			connectionContext = null;
			pstmt = null;
			conn = null;
		} catch (Exception exception) {
			exception.printStackTrace();
			connectionContext = null;
			pstmt = null;
			conn = null;
		}finally{
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){	try{ConnectionResource.release(conn);}catch(Exception ex3){ex3.printStackTrace();}}
		}
	}
	
	//���� ID�� �α�� ID ����
	public String getUserID(String sessionID){
		return (String)loginUsers.get(sessionID);
	}
	
	//���� �����ڼ�
	public int getUserCount(){
		return loginUsers.size();
	}

	//���� ������ ����Ʈ
	public Hashtable getUserList(){
		return loginUsers;
	}
	
	//loginUser list Ŭ����
	public int loginUsers_clear(){
		loginUsers.clear();
		return loginUsers.size();
	}
	
	//�α��� ������Ʈ
	public void updateLoginIp(String UserId, String IpAddr, String Url) throws SQLException, Exception {
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
        Connection        conn        = null;
		ConnectionContext connectionContext = new ConnectionResource();
				
		try { 
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
			strQuery.append("UPDATE CMM0040 set CM_LOGINDT=sysdate,              \n");
			strQuery.append("                   CM_CONURL=?,                     \n");
			strQuery.append("                   CM_IPADDRESS=?,CM_ERCOUNT=0      \n");
			strQuery.append(" WHERE CM_USERID = ?                \n");
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, Url);
            pstmt.setString(2, IpAddr);
            pstmt.setString(3, UserId);
            pstmt.executeUpdate();
            pstmt.close();
            
            conn.close();
            
            pstmt = null;
            conn = null;
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## LoginManager.updateLoginIp() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## LoginManager.updateLoginIp() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## LoginManager.updateLoginIp() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## LoginManager.updateLoginIp() Exception END ##");				
			throw exception;
		}finally{
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## LoginManager.updateLoginIp() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}

	// �α׾ƿ� ������Ʈ
	public void updateLogOut(String UserId) throws SQLException, Exception {
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
        Connection        conn        = null;      
		ConnectionContext connectionContext = new ConnectionResource();
 		
		try { 
		    conn = connectionContext.getConnection();
		    strQuery.setLength(0);
			strQuery.append("UPDATE CMM0040 set CM_STATUS = '0', CM_LOGOUTDT = sysdate   \n");
			strQuery.append("                  WHERE CM_USERID = ?   					\n");
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, UserId);
            pstmt.executeUpdate();
            pstmt.close();
            
            conn.close();
            
            pstmt = null;
            conn = null;
            
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			throw exception;
		}finally{
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
	
};
