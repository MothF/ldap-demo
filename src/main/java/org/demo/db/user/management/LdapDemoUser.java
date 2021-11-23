package org.demo.db.user.management;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.Set;

@Table(name = "USERS")
@Entity
public class LdapDemoUser implements UserDetails {

    @GeneratedValue
    @Id
    private Long id;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "USERNAME", unique = true)
    private String username;

    @Column(name = "ACCOUNT_NON_EXPIRED")
    private boolean accountNonExpired;

    @Column(name = "ACCOUNT_NON_LOCKED")
    private boolean accountNonLocked;

    @Column(name = "CREDENTIALS_NON_EXPIRED")
    private boolean credentialsNonExpired;

    @Column(name = "ENABLED")
    private boolean enabled;

    @JoinTable(name = "USER_ROLES",
            joinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "ID"),
            inverseJoinColumns = @JoinColumn(name = "ROLE_ID", referencedColumnName = "ID"))
    @ManyToMany
    private Set<LdapDemoRole> authorities;

    public LdapDemoUser() {
    }

    public Long getId() {
        return id;
    }

    @Override
    public Set<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setAccountNonExpired(boolean accountNonExpired) {
        this.accountNonExpired = accountNonExpired;
    }

    public void setAccountNonLocked(boolean accountNonLocked) {
        this.accountNonLocked = accountNonLocked;
    }

    public void setCredentialsNonExpired(boolean credentialsNonExpired) {
        this.credentialsNonExpired = credentialsNonExpired;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setAuthorities(Set<LdapDemoRole> authorities) {
        this.authorities = authorities;
    }

}
