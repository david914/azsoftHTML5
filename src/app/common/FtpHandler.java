/*****************************************************************************************
	1. program ID	: FtpHandler.java
	2. create date	: 2008.09. 21
	3. auth		    : no name
	4. update date	: 
	5. auth		    : 
	6. description	: FtpHandler
*****************************************************************************************/

package app.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.commons.net.ftp.FTP;

import org.apache.log4j.Logger;
import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;

public class FtpHandler {
	
	Logger ecamsLogger = EcamsLogger.getLoggerInstance();
	
	private static String sServer = ""; //���� ������
	private static int iPort = 21;
	private static String sId = ""; //����� ���̵�
	private static String sPassword = ""; //��й�ȣ
	private static String clientPath = "";
	private static String serverPath = "";
	private static int errCnt = 0;
	FTPClient ftpClient;
 
	// ������ ����
	private void connect() {
		try {
			ftpClient.connect(sServer, iPort);
			int reply;
			//���� �õ���, �����ߴ��� ���� �ڵ� Ȯ��
			reply = ftpClient.getReplyCode();
	    
			if(!FTPReply.isPositiveCompletion(reply)) {
				ftpClient.disconnect();
				ecamsLogger.error("�����κ��� ������ �źδ��߽��ϴ�");
			}
			
		}catch (IOException ioe) {
			if(ftpClient.isConnected()) {
				try {
					ftpClient.disconnect();
				} catch(IOException f) {
					++errCnt;
				}
			}
			ecamsLogger.error("������ ������ �� �����ϴ�");
		}
	}
   
	// ������ �н������ �α���
	private boolean login() {
		
		try {
			this.connect();
			return ftpClient.login(sId, sPassword);
		}catch (IOException ioe) {
			++errCnt;
			ecamsLogger.error("������ �α��� ���� ���߽��ϴ�");
		}
		return false;
	}
	
	// �����κ��� �α׾ƿ� => 090922 ���� �׽�Ʈ �ʿ���.
	private boolean logout() {
	
		try {
			return ftpClient.logout();
		}catch (IOException ioe) {
			++errCnt;
			ecamsLogger.error("�α׾ƿ��� ���� ���߽��ϴ�");
		}
		return false;
	}
	   
	// FTP�� ls ���, ��� ���� ����Ʈ�� �����´�
	private FTPFile[] list(String tagetPath) {
	
		FTPFile[] files = null;
		try {
			files = this.ftpClient.listFiles(tagetPath);
			//"�����̸�: " + file.getName() + " ������ : " + file.getSize()
			return files;
		}catch (IOException ioe) {
			++errCnt;
			ecamsLogger.error("�����κ��� ���� ����Ʈ�� �������� ���߽��ϴ�");
		}
		return null;
	}
	
	// ������ ����(���� -> ����PC) �޴´�
	private boolean get(String targetfullName, String name) {
		
		boolean flag = false;
		FileOutputStream output = null;
		File local = null;
		
		try {
			//�޴� ���� ���� �� ��ġ�� �� �̸����� ���� �����ȴ�
		    local = new File(name);//DownDir + name
		    output = new FileOutputStream(local);
		    
		}catch (FileNotFoundException fnfe) {
			++errCnt;
			ecamsLogger.error("�ٿ�ε��� ���丮�� �����ϴ�");
			return flag;
		}
		
		//File file = new File(targetfullName);
		try {
			ftpClient.setFileType(ftpClient.BINARY_FILE_TYPE);
			if (ftpClient.retrieveFile(targetfullName, output)) {
				flag = true;
			}
			output.close();
		}catch (IOException ioe) {
			++errCnt;
			ecamsLogger.error("������ �ٿ�ε� ���� ���߽��ϴ�");
		}
		return flag;
	}
	
	// ������ ����(����PC -> ����) �Ѵ�
	private boolean put(String fullName, String targetfullName) {
	
		boolean flag = false;
		InputStream input = null;
		File localFile = null;
		
		try {
			localFile = new File(fullName);
			input = new FileInputStream(localFile);
		}catch(FileNotFoundException e) {
			++errCnt;
			e.printStackTrace();
			return flag;
		}
		
		try {
			//targetfullName(���+���ϸ�)���� ���� ���ε�
			//������ ���ε��� ������ ���ϸ��� �����ϸ� �����
			//if(ftpClient.storeFile(targetfullName, input)) {
			
			//������ ���ε��� ������ ���ϸ��� �����ϸ� flase ����
			if(ftpClient.appendFile(targetfullName, input)) {
				flag = true;
			}else{
				ecamsLogger.error("������ ������ ������ �����մϴ�");
				flag = false;
			}
			input.close();
		}catch(IOException e) {
			++errCnt;
			ecamsLogger.error("������ �������� ���߽��ϴ�");
			e.printStackTrace();
			return flag;
		}
		return flag;
	}
	
	// ���� ���丮 �̵�
	private void cd(String path) {
	    
		try {
			ftpClient.changeWorkingDirectory(path);
		}catch (IOException ioe) {
			++errCnt;
			ecamsLogger.error("������ �̵����� ���߽��ϴ�");
		}
	}
	
	// �����κ��� ������ �ݱ�
	private void disconnect() {
	    
		try {
			ftpClient.disconnect();
		}catch (IOException ioe) {
			ioe.printStackTrace();
			++errCnt;
			ecamsLogger.error("FTP disconnect an error");
		}
	}
	
	// FTP ���� Ÿ�� ����
	private void setFileType(int FileType) {
		try {
			ftpClient.setFileType(FileType);
		}catch(Exception e) {
			++errCnt;
			ecamsLogger.error("���� Ÿ���� �������� ���߽��ϴ�");
		}      
	}
	
	// UpdateCmr1100
	public boolean UpdateCmr1100(Connection _conn,String AcptNo, 
			String SerNo) throws SQLException, Exception {
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();

		try {
        	strQuery.setLength(0);
        	strQuery.append("Update Cmr1100 set cr_errcd='0000' ");
            strQuery.append("where cr_acptno=? ");//AcptNo
            strQuery.append("  and CR_SERNO=? ");//serno �Ϸù�ȣ
        	pstmt = _conn.prepareStatement(strQuery.toString());
        	pstmt.setString(1,AcptNo);
        	pstmt.setString(2,SerNo);
        	pstmt.executeUpdate();
        	pstmt.close();
        	pstmt=null;
        	
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			++errCnt;
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			++errCnt;
			throw exception;
		}
		return true;
	}
	
	// UpdateCmr9900_STR
	public boolean UpdateCmr9900_STR(Connection _conn,String AcptNo,
			String ConMSG,String SinCd) throws SQLException, Exception {
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();

		try {
			strQuery.setLength(0);
			strQuery.append("Begin CMR9900_STR ( ");
			strQuery.append("?,?,'eCAMS�ڵ�ó��','9',?,'1' ); End;");//AcptNo,ConMSG,SinCd
			pstmt = _conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, AcptNo);
			pstmt.setString(2, ConMSG);
			pstmt.setString(3, SinCd);
			pstmt.executeUpdate();
			pstmt.close();
        	
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			++errCnt;
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			++errCnt;
			throw exception;
		}
		return true;
	}
	
	// FTP Up Load Handler GbnCd == cm_pathcd(cmm0012),Acptno == ��û��ȣ,tblNm == ���̺��
	public int FtpUpLoad(String GbnCd,String AcptNo,String tblNm) 
		throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		
		ConnectionContext connectionContext = new ConnectionResource();
		try{
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
			strQuery.append("select cm_path,cm_downip,cm_downusr,cm_downpass from cmm0012 ");
			strQuery.append("where cm_stno = 'ECAMS' ");
			strQuery.append("  and cm_pathcd = ? ");	//cm_pathcd
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, GbnCd);
    		rs = pstmt.executeQuery();
			if (rs.next()){
				sServer = rs.getString("cm_downip");
				sId = rs.getString("cm_downusr");
				sPassword = rs.getString("cm_downpass");
				serverPath = rs.getString("cm_path");
			}else {
				throw new Exception("�ڵ�["+ GbnCd +"]�� �ش�Ǵ� ������ �����ϴ�.");
			}
			rs.close();
			pstmt.close();
			
			ftpClient = new FTPClient();
			//ftpClient.setControlEncoding("euc-kr");
			
			// ���� ����
			connect();
			
			// ���� �α���
			login();
			
			// ���� Ÿ�� ����
			setFileType(FTP.BINARY_FILE_TYPE);//BINARY_FILE_TYPE ��
			
			if (tblNm.equals("Cmr1100")){//Cmr1100 == ���⹰ ���� ��û��
				strQuery.setLength(0);
				strQuery.append("Select a.cr_serno,a.cr_docid,REPLACE(a.cr_pcdir,'\','\\') as pcdir,a.cr_version,b.cr_docfile ");
				strQuery.append("from cmr1100 a, cmr0030 b ");
				strQuery.append("where a.cr_acptno = ? ");
				strQuery.append("  and b.cr_docid = a.cr_docid ");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, AcptNo);
				rs = pstmt.executeQuery();
				String docid = "";
				String targetfullName = "";
				int version = 0;
				while (rs.next()){
					docid = rs.getString("cr_docid");
					version = Integer.parseInt(rs.getString("cr_version"));
					clientPath = rs.getString("pcdir") + "\\" + rs.getString("cr_docfile");
					targetfullName = serverPath + "/" + docid.substring(6,10) + "/" + docid.substring(0,6) + "/" + docid + "." + Integer.toString(version);
					
					ecamsLogger.debug("filename cmr1100   " +   clientPath + "\n");
					ecamsLogger.error("local_file cmr1100   " + targetfullName + "\n");
					
					if (put(clientPath,targetfullName))					
						//cmr1100 cr_errcd='0000' Handler
						UpdateCmr1100(conn,AcptNo,rs.getString("cr_serno"));
				}
				rs.close();
				pstmt.close();
				
				//cmr9900_STR  PROCEDURE Handler
				if (errCnt == 0)
					UpdateCmr9900_STR(conn,AcptNo,"SYSDUP",AcptNo.substring(6,8));
			}
			// ���� ����
			disconnect();
			
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			
		}catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			++errCnt;
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			++errCnt;
			throw exception;
		}finally{
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					++errCnt;
					ex3.printStackTrace();
				}
			}
		}
		return errCnt;
	}
	
	public int FtpDownLoad(String GbnCd,String AcptNo,String tblNm) 
		throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		
		ConnectionContext connectionContext = new ConnectionResource();
		try{
			conn = connectionContext.getConnection();
			strQuery.setLength(0);
			strQuery.append("select cm_path,cm_downip,cm_downusr,cm_downpass from cmm0012 ");
			strQuery.append("where cm_stno = 'ECAMS' ");
			strQuery.append("  and cm_pathcd = ? ");	//cm_pathcd
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(1, GbnCd);
			rs = pstmt.executeQuery();
			if (rs.next()){
				sServer = rs.getString("cm_downip");
				sId = rs.getString("cm_downusr");
				sPassword = rs.getString("cm_downpass");
				serverPath = rs.getString("cm_path");
			}else {
				throw new Exception("�ڵ�["+ GbnCd +"]�� �ش�Ǵ� ������ �����ϴ�.");
			}
			rs.close();
			pstmt.close();
			
			ftpClient = new FTPClient();
			
			// ���� ����
			connect();
			
			// ���� �α���
			login();
			
			// ���� Ÿ�� ����
			setFileType(FTP.BINARY_FILE_TYPE);//BINARY_FILE_TYPE �� 
			
			if (tblNm.equals("Cmr1100")){//Cmr1100 == ���⹰ ���� ��û��
				strQuery.setLength(0);
				strQuery.append("SELECT b.cr_docfile, a.cr_docid, a.cr_pcdir, a.cr_version ");
				strQuery.append("from cmr1100 a, cmr0030 b ");
				strQuery.append("where a.cr_acptno = ? ");
				strQuery.append("  and b.cr_docid = a.cr_docid ");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, AcptNo);
				rs = pstmt.executeQuery();
				String docid = "";
				String targetfullName = "";
				int version = 0;
				while (rs.next()){
					docid = rs.getString("cr_docid");
					version = Integer.parseInt(rs.getString("cr_version"));
					clientPath = rs.getString("cr_pcdir") + "\\" + rs.getString("cr_docfile");
					targetfullName = serverPath + "/" + docid.substring(6,10) + "/" + docid.substring(0,6) + "/" + docid + "." + Integer.toString(version);
					
					if (get(targetfullName,clientPath))
						//cmr1100 cr_errcd='0000' Handler
						UpdateCmr1100(conn,AcptNo,rs.getString("cr_serno"));
				}
				if (errCnt == 0)
					//cmr9900_STR  PROCEDURE Handler
					UpdateCmr9900_STR(conn,AcptNo,"SYSDDN",AcptNo.substring(6,8));
			}
			// ���� ����
			disconnect();
			
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			
		}catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			++errCnt;
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			++errCnt;
			throw exception;
		}finally{
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					++errCnt;
					ex3.printStackTrace();
				}
			}
		}
		return errCnt;
	}

}