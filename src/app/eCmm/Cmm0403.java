package app.eCmm;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.log4j.Logger;

import app.common.LoggableStatement;

import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;

public class Cmm0403 {

    Logger ecamsLogger  = EcamsLogger.getLoggerInstance();

	public Object[] all_sign_up(ArrayList<HashMap<String,String>> rtList) throws SQLException, Exception{
    	Connection			conn		= null;
    	PreparedStatement	pstmt		= null;
		ResultSet         	rs          = null;
		StringBuffer      	strQuery    = new StringBuffer();
		ArrayList<HashMap<String,String>> rsval = new ArrayList<HashMap<String,String>>();
		HashMap<String,String> rst = null;

		String imsiUser = ""; //�������� ������ ID
		boolean check = false; // �ߺ�üũ true�� ����ȭ����üũ�ؼ� skip �ϰų� update , false�� insert
		String imsiPosition = ""; //����
		String imsiDuty = ""; //����
		String imsiCodename = ""; //�������
		String imsiJobcd = ""; //����
		String imsiSyscd = ""; //�ý���
		String imsiUpperProject = ""; //�Ҽ�����(����/����) 
		String imsiProject = ""; //�Ҽ�����
		String imsiHandrun = "";//����ȭ ����
		String imsiEmail = ""; //�̸����ּ�
		String imsiTelno1 = ""; //��ȭ��ȣ
		String imsiTelno2 = ""; //�ڵ�����ȣ
    	//String imsiAdmin = ""; //������ ����
    	//String imsiManid = ""; // ��������
		
    	int count = 0; //����üũ
    	int j = 0;
		int c = 0;
		int k =0;
    	int codenamecheck = 0;
    	String code= "";
		String[] result =  null;
		String er = "";
		StringBuffer error = null;

		ConnectionContext connectionContext = new ConnectionResource();

		try{
			System.out.println("check1");
			conn = connectionContext.getConnection();
			//conn.setAutoCommit(false);

			for(int i=0; i<rtList.size(); i++)		//����ڸ���Ʈ ��ŭ for��
			{
				conn.setAutoCommit(false);
				
				imsiUser = ""; // ID
				check = false; // �ߺ�üũ true�� ����ȭ����üũ�ؼ� skip �ϰų� update , false�� insert
				imsiPosition = ""; //����
				imsiDuty = ""; //����
				imsiCodename = ""; //�������
				imsiJobcd = ""; //����
				imsiSyscd = ""; //�ý���
				imsiProject = ""; //�Ҽ�����
				imsiHandrun = "";//����ȭ ����
		    	//imsiAdmin = ""; //������ ����
		    	//imsiManid = ""; // ��������
		    	count = 0;
		        j = 0;
				c = 0;
				k =0;
		    	codenamecheck = 0;
		    	//�ʱ�ȭ�۾� ��


		    	if(rtList.get(i).get("CM_EMAIL") == null || rtList.get(i).get("CM_EMAIL") == ""){
		    		imsiEmail = "";
		    	}else{
		    		imsiEmail = rtList.get(i).get("CM_EMAIL").toString().trim();
		    	}

		    	if(rtList.get(i).get("CM_TELNO1") == null || rtList.get(i).get("CM_TELNO1") == ""){
		    		imsiTelno1 = "";
		    	}else{
		    		imsiTelno1 = rtList.get(i).get("CM_TELNO1").toString().trim();
		    	}

		    	if(rtList.get(i).get("CM_TELNO2") == null || rtList.get(i).get("CM_TELNO2") == ""){
		    		imsiTelno2 = "";
		    	}else{
		    		imsiTelno2 = rtList.get(i).get("CM_TELNO2").toString().trim();
		    	}

		    	if( (rtList.get(i).get("CM_SYSCD") == null) || rtList.get(i).get("CM_SYSCD").equals("") ){
		    		imsiSyscd = "";
		    	}else{
		    		imsiSyscd = rtList.get(i).get("CM_SYSCD").toString().trim();
		    	}
		    	


				//USERID �����ϴ��� 40 ���̺� ��ȸ �׸��� ����ȭ���� ��󿩺� ��ȸ
				strQuery.setLength(0);
				strQuery.append("select cm_userid,cm_handrun,cm_admin \n");
				strQuery.append(" from cmm0040 \n");
				strQuery.append("where cm_userid = ? \n");
				pstmt = conn.prepareStatement(strQuery.toString());
				pstmt.setString(1, rtList.get(i).get("CM_USERID").toString().trim());
				rs = pstmt.executeQuery();
				if(rs.next()){//����������� ���
					check = true;
					imsiUser = rs.getString("cm_userid");
					imsiHandrun = rs.getString("cm_handrun");

//					if (imsiHandrun.equals("N") && rtList.get(i).get("CM_ADMIN").toString().trim().equals("1")) {
//						imsiAdmin = "1";
//					} else {
//						imsiAdmin =  "0";
//					}
				}else{//�������� �������
					imsiUser = rtList.get(i).get("CM_USERID").toString().trim();
					imsiHandrun = "N";
					//imsiAdmin = rtList.get(i).get("CM_ADMIN").toString().trim();
				}

				System.out.println("check3");
				rst = new HashMap<String, String>();
				//����ȭ���� ����� ���� �ٷ� skip
				if (imsiHandrun.equals("N")) {//����ڰ� �������� ������� �Ǵ� ����ȭ ��� �϶�

					rst.put("CM_USERID", imsiUser);
					rst.put("CM_USERNAME", rtList.get(i).get("CM_USERNAME") == null ? "" : rtList.get(i).get("CM_USERNAME").toString().trim());
					rst.put("CM_TELNO1", imsiTelno1);
					rst.put("CM_TELNO2", imsiTelno2);
					rst.put("CM_EMAIL", imsiEmail);
					rst.put("CM_SYSCD", imsiSyscd);

					rs.close();
					pstmt.close();
					
					strQuery.setLength(0);
					strQuery.append("select cm_micode \n");
					strQuery.append("  from cmm0020 \n");
					strQuery.append(" where cm_macode='POSITION'   \n");
					strQuery.append("   and cm_codename = upper(?) \n");
					
					pstmt = conn.prepareStatement(strQuery.toString());
					pstmt.setString(1, rtList.get(i).get("CM_POSITION").toString().trim() );//���� ������
					
					rs = pstmt.executeQuery();
					
					if (rs.next()){
						imsiPosition = rs.getString("cm_micode");
						rst.put("CM_POSITION", rtList.get(i).get("CM_POSITION") == null ? "" : rtList.get(i).get("CM_POSITION").toString().trim());
					}else{
						rst.put("CM_POSITION", rtList.get(i).get("CM_POSITION") == null ? "" : rtList.get(i).get("CM_POSITION").toString().trim() + "[Error]");
						count++;
					}
					
					rs.close();
					pstmt.close();
					
					imsiDuty = "99"; //�������� ����

					/*					
					if(rtList.get(i).get("CM_CODENAME") != null && rtList.get(i).get("CM_CODENAME") != ""){//���� ������
						code = rtList.get(i).get("CM_CODENAME").toString().trim();
						result = code.split(",");

						for(j=0; j<result.length; j++){
//							if(result[j].equals("���ߴ����") || result[j].equals("��Ʈ��") || result[j].equals("����")){
//								codenamecheck++;
//							}
							rs.close();
							pstmt.close();
							strQuery.setLength(0);
							strQuery.append("select cm_micode        \n");
							strQuery.append("  from cmm0020          \n");
							strQuery.append(" where cm_macode='DUTY' \n");
							strQuery.append("   and cm_codename = upper(?)  \n");
							pstmt = conn.prepareStatement(strQuery.toString());
							pstmt.setString(1, result[j]);
							rs = pstmt.executeQuery();
							if (rs.next()){
								codenamecheck++;
							}
						}
					} else{
						count ++;
					}

					if(codenamecheck == 0){
						count++;
					}else{//������ �������� ��ȿ�Ҷ�
						rs.close();
						pstmt.close();
					    strQuery.setLength(0);
						strQuery.append("select min(cm_micode) as cm_micode  \n");
						strQuery.append("  from cmm0020 \n");
						strQuery.append(" where cm_macode='DUTY'   \n");

						strQuery.append(" and cm_codename in ( \n");
						if (result.length == 1)
							strQuery.append(" upper(?) ");
						else{
							for (j=0;j<result.length;j++){
								if (j == result.length-1)
									strQuery.append(" upper(?) ");
								else
									strQuery.append(" upper(?) ,");
							}
						}
						strQuery.append(" ) \n");

						//strQuery.append("   and cm_codename = ?     \n");
						pstmt = conn.prepareStatement(strQuery.toString());
						for (j=0;j<result.length;j++){
							pstmt.setString(j+1, result[j]);
						}
						rs = pstmt.executeQuery();

						if (rs.next()){
							imsiDuty = rs.getString("cm_micode");
						}
					}

					rs.close();
					pstmt.close();
					*/
					
					//���� �� �Ҽ� �μ� ��ȸ
					if( (rtList.get(i).get("CM_UPPERPROJECT") != null) && !rtList.get(i).get("CM_UPPERPROJECT").equals("") ){//���� ���ΰ�
						strQuery.setLength(0);
						strQuery.append("SELECT		cm_deptcd			\n");
						strQuery.append("FROM		cmm0100				\n");
						strQuery.append("WHERE		cm_deptname = ?		\n");
						
						pstmt = conn.prepareStatement(strQuery.toString());
						pstmt.setString(1, rtList.get(i).get("CM_UPPERPROJECT").toString().trim() );
						rs = pstmt.executeQuery();
						
						if ( rs.next() ){ //�Է��� ���� ���� db�� ������ ������
							imsiUpperProject = rs.getString("cm_deptcd");
						}else{ //�Է��� ���� ���� db�� ������ ������ �ű� ���
							strQuery.setLength(0);
							strQuery.append("SELECT	'HAND' || LPAD(TO_NUMBER(NVL(MAX(SUBSTR(cm_deptcd,5,9)),0)) + 1,5,'0') AS cm_deptcd		\n");	
							strQuery.append("FROM	cmm0100									\n");
							strQuery.append("WHERE	SUBSTR(cm_deptcd,1,4) ='HAND'			\n");
							
							PreparedStatement pstmt2 = conn.prepareStatement(strQuery.toString());
							ResultSet rs2 = pstmt2.executeQuery();
							
							if( rs2.next() ) {
								imsiUpperProject = rs2.getString("cm_deptcd");
							}
							
							rs2.close();
							pstmt2.close();
							
				        	strQuery.setLength(0);
				        	strQuery.append("INSERT	INTO cmm0100 (CM_DEPTCD,CM_DEPTNAME,CM_UPDEPTCD,CM_USEYN,CM_HANDYN)		\n");
				        	strQuery.append("VALUES (?, ?, (SELECT MIN(cm_deptcd) FROM		cmm0100), 'Y', 'Y')				\n");
				        	pstmt2 = conn.prepareStatement(strQuery.toString());
				        	//pstmt =  new LoggableStatement(conn, strQuery.toString());
				        	pstmt2.setString(1, imsiUpperProject);
				        	pstmt2.setString(2, rtList.get(i).get("CM_UPPERPROJECT").toString().trim());
				        	////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
				        	pstmt2.executeUpdate();
				        	pstmt2.close();
						}
						
						rs.close();
						pstmt.close();
						
						//�ҼӺμ� ��ȸ
						if( (rtList.get(i).get("CM_PROJECT") != null) && !rtList.get(i).get("CM_PROJECT").equals("") ){
							strQuery.setLength(0);
							strQuery.append("SELECT	cm_deptcd				\n");
							strQuery.append("FROM	cmm0100					\n");
							strQuery.append("WHERE	cm_deptname = ?			\n");
							strQuery.append("AND	cm_updeptcd = ?			\n");
							
							pstmt = conn.prepareStatement(strQuery.toString());
							pstmt.setString(1, rtList.get(i).get("CM_PROJECT").toString().trim() );
							pstmt.setString(2, imsiUpperProject );
							rs = pstmt.executeQuery();
							
							if( rs.next() ) { //�μ������� ������
								imsiProject = rs.getString("cm_deptcd");
							} else { //�μ������� ������
								strQuery.setLength(0);
								strQuery.append("SELECT	'HAND' || LPAD(TO_NUMBER(NVL(MAX(SUBSTR(cm_deptcd,5,9)),0)) + 1,5,'0') AS cm_deptcd		\n");	
								strQuery.append("FROM	cmm0100									\n");
								strQuery.append("WHERE	SUBSTR(cm_deptcd,1,4) ='HAND'			\n");
								
								PreparedStatement pstmt2 = conn.prepareStatement(strQuery.toString());
								ResultSet rs2 = pstmt2.executeQuery();
								
								if( rs2.next() ) {
									imsiProject = rs2.getString("cm_deptcd");
								}
								
								rs2.close();
								pstmt2.close();
								
					        	strQuery.setLength(0);
					        	strQuery.append("INSERT	INTO cmm0100 (CM_DEPTCD,CM_DEPTNAME,CM_UPDEPTCD,CM_USEYN,CM_HANDYN)		\n");
					        	strQuery.append("VALUES (?, ?, ?, 'Y', 'Y')													\n");
					        	pstmt2 = conn.prepareStatement(strQuery.toString());
					        	//pstmt =  new LoggableStatement(conn, strQuery.toString());
					        	pstmt2.setString(1, imsiProject);
					        	pstmt2.setString(2, rtList.get(i).get("CM_PROJECT").toString().trim());
					        	pstmt2.setString(3, imsiUpperProject);
					        	////ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
					        	pstmt2.executeUpdate();
					        	pstmt2.close();
							}
							
//							rst.put("CM_UPPERPROJECT", rtList.get(i).get("CM_UPPERPROJECT") == null ? "" : rtList.get(i).get("CM_UPPERPROJECT").toString().trim());
//							rst.put("CM_PROJECT", rtList.get(i).get("CM_PROJECT") == null ? "" : rtList.get(i).get("CM_PROJECT").toString().trim());
							
							rs.close();
							pstmt.close();
						} else {
							imsiProject = imsiUpperProject;
//							rst.put("CM_UPPERPROJECT", rtList.get(i).get("CM_UPPERPROJECT") == null ? "" : rtList.get(i).get("CM_UPPERPROJECT").toString().trim());
//							rst.put("CM_PROJECT", rtList.get(i).get("CM_PROJECT") == null ? "" : rtList.get(i).get("CM_PROJECT").toString().trim() + "[Error]");
//							count++;
						}
						rst.put("CM_UPPERPROJECT", rtList.get(i).get("CM_UPPERPROJECT") == null ? "" : rtList.get(i).get("CM_UPPERPROJECT").toString().trim());
						rst.put("CM_PROJECT", rtList.get(i).get("CM_PROJECT") == null ? "" : rtList.get(i).get("CM_PROJECT").toString().trim());
					} else { //������ ���ΰ��� ������ �⺻���� ������.
						strQuery.setLength(0);
						strQuery.append("SELECT		MIN(cm_deptcd) AS cm_deptcd		\n");
						strQuery.append("FROM		cmm0100							\n");
						
						pstmt = conn.prepareStatement(strQuery.toString());
						
						rs = pstmt.executeQuery();
						
						if ( rs.next() ){
							imsiProject = rs.getString("cm_deptcd");
							rst.put("CM_UPPERPROJECT", rtList.get(i).get("CM_UPPERPROJECT") == null ? "" : rtList.get(i).get("CM_UPPERPROJECT").toString().trim());
							rst.put("CM_PROJECT", rtList.get(i).get("CM_PROJECT") == null ? "" : rtList.get(i).get("CM_PROJECT").toString().trim());
						}
						
						pstmt.close();
						rs.close();
					}

					/*
					strQuery.setLength(0);
					strQuery.append("select cm_deptcd  \n");
					strQuery.append("  from cmm0100  \n");
					strQuery.append(" where cm_deptname = ?   \n");
					pstmt = conn.prepareStatement(strQuery.toString());
					pstmt.setString(1, rtList.get(i).get("CM_PROJECT").toString().trim() );
					rs = pstmt.executeQuery();
					if (rs.next()){
						imsiProject = rs.getString("cm_deptcd");
						rst.put("CM_PROJECT", rtList.get(i).get("CM_PROJECT").toString().trim());
					}else{
						rst.put("CM_PROJECT",  rtList.get(i).get("CM_PROJECT").toString().trim() + "[Error]");
						 count++;
					}
					*/
					
//					if(rtList.get(i).get("CM_MANID").toString().trim().equals("y") || rtList.get(i).get("CM_MANID").toString().trim().equals("Y") ){
//						imsiManid = "Y";
//						rst.put("CM_MANID", imsiManid);
//					}else if(rtList.get(i).get("CM_MANID").toString().trim().equals("n") || rtList.get(i).get("CM_MANID").toString().trim().equals("N")){
//						imsiManid = "N";
//						rst.put("CM_MANID", imsiManid);
//					}else{
//						rst.put("CM_MANID", rtList.get(i).get("CM_MANID").toString().trim() + "[Error]");
//						count++;
//					}
//
//					if(imsiAdmin.equals("1") || imsiAdmin.equals("0")){
//						rst.put("CM_ADMIN", imsiAdmin);
//					}else{
//						imsiAdmin = "0";
//						rst.put("CM_ADMIN", rtList.get(i).get("CM_ADMIN").toString().trim() + "[Error]");
//					    count++;
//					}
					rst.put("colorsw", "0");

					//count == 0 �� ��� ����/////////////////////////////////////////////////////////////////////////////////////////////////////
					if(count == 0){//���� �Է°��� ������ ������
						if(check){//userid ���� �Ҷ� = ������ ����ڰ� DB�� ����Ǿ� �ִ� ���
							pstmt.close();
							rs.close();
							strQuery.setLength(0);
							strQuery.append("update cmm0040 	\n");
							strQuery.append("set cm_username = ?, cm_project = ?, cm_position = ?, cm_duty = ?, cm_email = ?, cm_telno1 = ?, cm_telno2 = ?, cm_manid = 'Y', cm_admin = '0'  	\n");
							strQuery.append("where cm_userid = ?");
							pstmt = conn.prepareStatement(strQuery.toString());
							pstmt.setString(1, rtList.get(i).get("CM_USERNAME").toString().trim());
							pstmt.setString(2, imsiProject.trim());
							pstmt.setString(3, imsiPosition.trim());
							pstmt.setString(4, imsiDuty.trim());
							pstmt.setString(5, imsiEmail);
							pstmt.setString(6, imsiTelno1);
							pstmt.setString(7, imsiTelno2);
							pstmt.setString(8, imsiUser);
//							pstmt.setString(8, imsiManid);
//							pstmt.setString(9, imsiAdmin);
//							pstmt.setString(10, imsiUser);
							pstmt.executeUpdate();

						}
						else{//�ű� ����� DB insert
							pstmt.close();
							rs.close();
							strQuery.setLength(0);
							strQuery.append("insert into cmm0040(cm_userid, cm_username, cm_project, cm_position, cm_duty, cm_email, cm_telno1, cm_telno2, cm_manid, cm_admin, cm_dumypw, cm_juminnum, cm_handrun, cm_status)   	\n");
							strQuery.append(" values(?,?,?,?,?,?,?,?,'Y','0','1234','1234','N','0')");
							
							pstmt = new LoggableStatement(conn,strQuery.toString());
							//pstmt = conn.prepareStatement(strQuery.toString());
							pstmt.setString(1, imsiUser);
							pstmt.setString(2, rtList.get(i).get("CM_USERNAME").toString().trim());
							pstmt.setString(3, imsiProject.trim());
							pstmt.setString(4, imsiPosition.trim());
							pstmt.setString(5, imsiDuty.trim());
							pstmt.setString(6, imsiEmail);
							pstmt.setString(7, imsiTelno1);
							pstmt.setString(8, imsiTelno2);
//						    pstmt.setString(9, imsiManid);
//						    pstmt.setString(10, imsiAdmin);
							ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
						    pstmt.executeUpdate();
						}
						//40 ���� �Ϸ�


						//43 ���� ����
					//////////////////////////////////////////////////////////////////////cmm0043
						//�ý��� �ڵ� ��������
				    	if( (rtList.get(i).get("CM_SYSCD") == null) || rtList.get(i).get("CM_SYSCD").equals("") ){
				    		imsiSyscd = "";
				    	} else {
							strQuery.setLength(0);
							strQuery.append("SELECT	cm_syscd		\n");
							strQuery.append("FROM	cmm0030			\n");
							strQuery.append("WHERE	cm_sysmsg = ?	\n");
							
							pstmt = conn.prepareStatement(strQuery.toString());
							pstmt.setString(1, rtList.get(i).get("CM_SYSCD").toString().trim());
							rs = pstmt.executeQuery();
							if(rs.next()){
								imsiSyscd = rs.getString("cm_syscd");
							} else {
								count++;
								rst.put("colorsw", "5");
								rst.put("CM_SYSCD", imsiSyscd + "[Error]");
								imsiSyscd = "";
							}
							
							rs.close();
							pstmt.close();
				    	}						
						
						if(rtList.get(i).get("CM_CODENAME") != null && rtList.get(i).get("CM_CODENAME") != ""){
							code= rtList.get(i).get("CM_CODENAME").toString().trim();
							result = code.split(",");
							er = "";
							pstmt.close();
							rs.close();
							strQuery.setLength(0);
							strQuery.append("delete from cmm0043  	\n");
							strQuery.append("where cm_userid = ?");
							pstmt = conn.prepareStatement(strQuery.toString());
							pstmt.setString(1, imsiUser);
							pstmt.executeUpdate();

							for(j=0; j<result.length; j++){
								pstmt.close();
								rs.close();
								strQuery.setLength(0);
								strQuery.append("select cm_micode	 	  \n");
								strQuery.append("  from cmm0020 		  \n");
								strQuery.append(" where cm_macode='RGTCD' \n");
								strQuery.append("   and cm_codename = upper(?)\n");
								pstmt = conn.prepareStatement(strQuery.toString());
								pstmt.setString(1, result[j]);
								rs = pstmt.executeQuery();

								if (rs.next()){
									imsiCodename = rs.getString("cm_micode");
									if (er.length() == 0) er = result[j];
									else er = er + "," + result[j];
									rst.put("CM_CODENAME", er);
								}else{
									if (er.length() == 0) er = result[j]+"[Error]";
									else er = er + "," +  result[j]+"[Error]";
									count++;
									rst.put("CM_CODENAME", er);
								}

								if (count == 0){
									pstmt.close();
									rs.close();
									strQuery.setLength(0);
									strQuery.append("insert into cmm0043(cm_userid, cm_rgtcd, cm_creatdt, cm_lastdt)   	\n");
									strQuery.append(" values(?,?,sysdate,sysdate)");
									pstmt = conn.prepareStatement(strQuery.toString());
									pstmt.setString(1, imsiUser);
									pstmt.setString(2, imsiCodename);
									pstmt.executeUpdate();
								}else{
									rst.put("colorsw", "4");//43 ���̺� �Է� ���� green
								}
							}//result.length for end

	//							pstmt.close();
	//							rs.close();
	//							strQuery.setLength(0);
	//							strQuery.append("select cm_rgtcd 	 \n");
	//							strQuery.append("from cmm0043 	 \n");
	//							strQuery.append("where cm_userid = ? 	\n");
	//							strQuery.append("and cm_rgtcd = '74' 	\n");
	//							pstmt = conn.prepareStatement(strQuery.toString());
	//							pstmt.setString(1, imsiUser);
	//							rs = pstmt.executeQuery();
	//							if (rs.next()){
	//							}
	//							else if (imsiAdmin.equals("1")) {
	//								pstmt.close();
	//								rs.close();
	//								strQuery.setLength(0);
	//								strQuery.append("insert into cmm0043(cm_userid, cm_rgtcd, cm_creatdt, cm_lastdt)   	\n");
	//								strQuery.append("values(?, '74', sysdate, sysdate)");
	//								pstmt = conn.prepareStatement(strQuery.toString());
	//								pstmt.setString(1, imsiUser);
	//								pstmt.executeUpdate();
	//							}
							}// 43 �����Ϸ�


							count = 0;

						//44 ���� ����
						//////////////////////////////////////////////////////////////////// //cmm0044
						if(rtList.get(i).get("CM_JOBNAME") != null && rtList.get(i).get("CM_JOBNAME") != ""){
							result = rtList.get(i).get("CM_JOBNAME").toString().trim().split(",");
							error = new StringBuffer();
							for(k=0; k<result.length; k++){
								imsiJobcd = "";

								pstmt.close();
								rs.close();
								strQuery.setLength(0);
								strQuery.append("select cm_jobcd  \n");
								strQuery.append("  from cmm0102  \n");
								strQuery.append(" where (cm_jobcd = ? or cm_jobname = ?)   \n");
								pstmt = conn.prepareStatement(strQuery.toString());
								//pstmt = new LoggableStatement(conn,strQuery.toString());
								pstmt.setString(1, result[k].trim());
								pstmt.setString(2, result[k].trim());
								//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
								rs = pstmt.executeQuery();
								if (rs.next()){
									imsiJobcd = rs.getString("cm_jobcd");
									c = 1;
									if(k == 0){
										error.append(result[k]);
									}else{
										error.append(","+ result[k]);
									}
								}else{
									c = 2;
									if(k == 0){
										error.append(result[k] + "[Error]");

										if(rst.get("colorsw").equals("4") ) rst.put("colorsw", "6");//43 44 ���̺� �Է� ���� cyan
										else rst.put("colorsw", "5");//44 ���̺� �Է� ���� magenta

									} else{
										error.append(","+ result[k] + "[Error]");
									}
									count++;
								}
								if(c == 1){
									//cmm0034 ��ȸ�ؼ� cm_syscd�� ������
									pstmt.close();
									rs.close();
									if( (imsiSyscd == null) || imsiSyscd.equals("") ) {
										strQuery.setLength(0);
										strQuery.append("select cm_syscd  \n");
										strQuery.append("  from cmm0034  \n");
										strQuery.append(" where cm_jobcd = ?   \n");
										pstmt = conn.prepareStatement(strQuery.toString());
										//pstmt = new LoggableStatement(conn,strQuery.toString());
										pstmt.setString(1, imsiJobcd);
										//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
										rs = pstmt.executeQuery();
										if (rs.next()){
											imsiSyscd = rs.getString("cm_syscd");
										}else{
											count++;
										}
									}

									if(k == 0){
										pstmt.close();
										rs.close();
										strQuery.setLength(0);
										strQuery.append("delete from cmm0044  	\n");
										strQuery.append("where cm_userid = ?");
										pstmt = conn.prepareStatement(strQuery.toString());
										//pstmt = new LoggableStatement(conn,strQuery.toString());
										pstmt.setString(1, imsiUser);
										//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
										pstmt.executeUpdate();
									}
									if(count == 0){
										if(rtList.get(i).get("CM_JOBNAME") != null && rtList.get(i).get("CM_JOBNAME") != ""){
											pstmt.close();
											rs.close();
											strQuery.setLength(0);
											strQuery.append("insert into cmm0044(cm_userid, cm_syscd, cm_jobcd) \n");
											strQuery.append(" values(?,?,?)");
											pstmt = conn.prepareStatement(strQuery.toString());
											//pstmt = new LoggableStatement(conn,strQuery.toString());
											pstmt.setString(1, imsiUser);
											pstmt.setString(2, imsiSyscd);
											pstmt.setString(3, imsiJobcd);
											//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
											pstmt.executeUpdate();
										}
									}
								}
								rst.put("CM_JOBNAME", error.toString());
							}
						}// 44 ���� �Ϸ�
					}//count == 0 �� ��� ��
					else{//���� ���� ���� ������ �ִ��� �ƴϸ� ����ȭ ���� ����� red
						rst.put("colorsw", "3");//red
						rst.put("CM_CODENAME", rtList.get(i).get("CM_CODENAME"));
						rst.put("CM_JOBNAME", rtList.get(i).get("CM_JOBNAME"));
					}
				}else{	//����ȭ���� ��� ��� ���� ������...
					rst = rtList.get(i);
					rst.put("colorsw", "7");//blue
				}
				rsval.add(rst);
//				if( !rst.get("colorsw").equals("3") && !rst.get("colorsw").equals("4") &&
//					!rst.get("colorsw").equals("5") && !rst.get("colorsw").equals("6") &&
//					!rst.get("colorsw").equals("7") ) {
				if( rst.get("colorsw").equals("0") ){
					conn.commit();
				} else {
					conn.rollback();
				}
			}

			rs.close();
			pstmt.close();
			//conn.commit();
			strQuery = null;
			rs = null;
			pstmt = null;
			conn = null;
			rst = null;

			return rsval.toArray();


		}catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			if (conn != null){
				conn.rollback();
			}
			ecamsLogger.error("## Cmm0403.java.allSign_up() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## eCmm0403.java.allSign_up() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			if (conn != null){
				conn.rollback();
			}
			ecamsLogger.error("## Cmm0403.allSign_up() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmm0403.allSign_up() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rtList != null)  	rtList = null;
			if (rsval != null) 	rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmm0403.allSign_up() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
    }//all_sing_up end
} //SingUp end
