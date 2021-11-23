package org.demo.db.user.management;

import org.springframework.security.core.GrantedAuthority;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.Set;

@Table(name = "ROLES", indexes = {
        @Index(name = "IDX_ROLE_AUTHORITY", columnList = "AUTHORITY")
})
@Entity
public class LdapDemoRole implements GrantedAuthority {

    @GeneratedValue
    @Column(name = "ID")
    @Id
    private Long id;

    @Column(name = "AUTHORITY", unique = true)
    private String authority;

    @ManyToMany(mappedBy = "authorities")
    private Set<LdapDemoUser> ldapDemoUsers;

    public Long getId() {
        return id;
    }

    public Set<LdapDemoUser> getUsers() {
        return ldapDemoUsers;
    }

    @Override
    public String getAuthority() {
        return this.authority;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    public void setUsers(Set<LdapDemoUser> ldapDemoUsers) {
        this.ldapDemoUsers = ldapDemoUsers;
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", authority='" + authority + '\'' +
                '}';
    }
}
