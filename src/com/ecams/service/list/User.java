package com.ecams.service.list;

import javax.servlet.http.*;

public class User implements HttpSessionBindingListener{
	private String userName;
	private String userId;

//User id �� Session id ���� Vector�� �߰� ��Ų��.
public void setAddUser(String name, String id)    
{
	userName=name;
	userId=id;
	UserList.addUser(userName,userId);  // �߰�
}

//User id ���� �޾Ƽ� �ش� User id�� Session id���� ����
public void setDelUser(String userName)         
{
	this.userName = userName;                 
	UserList.removeUser(userName);       //����
}

//User id������ �ش� Session id ���� return
public String getid(String name)             
{
	return UserList.getid(name);                    
}

//User id������ �ش� Session id ���� ��ü
public void setid(String name, String id)   
{
	UserList.setid(name,id);
}
public int logck(String name)      //User id������ login check
{
	return UserList.logck(name);
}

//��ü�� ���������� �ڵ������� ����
public void valueBound(HttpSessionBindingEvent event)        
{
	//UserList.addUser(userName);
}

//��ü�� ��������� ����.
public void valueUnbound(HttpSessionBindingEvent event)     
{
	UserList.removeUser(userName);
}

}
