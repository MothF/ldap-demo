package org.demo.db.user.management;

import com.amplicode.ldap.userdetails.UserDetailsSetters;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.PostLoad;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "USERS")
@Entity(name = "users")
public class User implements UserDetails, UserDetailsSetters {

    @GeneratedValue
    @Id
    private Long id;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "USERNAME", unique = true)
    private String username;

    @Column(name = "ACCOUNT_NON_EXPIRED")
    private boolean accountNonExpired = true;

    @Column(name = "ACCOUNT_NON_LOCKED")
    private boolean accountNonLocked = true;

    @Column(name = "CREDENTIALS_NON_EXPIRED")
    private boolean credentialsNonExpired = true;

    @Column(name = "ENABLED")
    private boolean enabled = true;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "phone")
    private String phone;

    @JoinTable(name = "USER_ROLES",
            joinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "ID"),
            inverseJoinColumns = @JoinColumn(name = "ROLE_ID", referencedColumnName = "ID"))
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.ALL})
    private Set<Role> roles = new LinkedHashSet<>();

    @Transient
    private Collection<? extends GrantedAuthority> grantedAuthorities = new LinkedHashSet<>();

    @PostLoad
    private void postLoad() {
        this.grantedAuthorities = this.roles.stream()
                .map(Role::getAuthority)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }


    public void addRoles(Collection<Role> roles) {
        this.roles.addAll(roles);
    }

    @Override
    public void setAuthorities(Collection<? extends GrantedAuthority> grantedAuthorities) {
        this.grantedAuthorities = grantedAuthorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.grantedAuthorities;
    }
}
