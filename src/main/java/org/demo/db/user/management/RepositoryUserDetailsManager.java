package org.demo.db.user.management;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Transactional
@Service
public class RepositoryUserDetailsManager implements UserDetailsManager {

    private final LdapDemoUserRepository ldapDemoUserRepository;
    private final LdapDemoRoleRepository ldapDemoRoleRepository;

    public RepositoryUserDetailsManager(LdapDemoUserRepository ldapDemoUserRepository, LdapDemoRoleRepository ldapDemoRoleRepository) {
        this.ldapDemoUserRepository = ldapDemoUserRepository;
        this.ldapDemoRoleRepository = ldapDemoRoleRepository;
    }

    public LdapDemoUser mapToUser(UserDetails details) {
        LdapDemoUser ldapDemoUser = new LdapDemoUser();
        ldapDemoUser.setUsername(details.getUsername());
        ldapDemoUser.setPassword(details.getPassword());
        ldapDemoUser.setEnabled(details.isEnabled());
        ldapDemoUser.setAccountNonExpired(details.isAccountNonExpired());
        ldapDemoUser.setAccountNonLocked(details.isAccountNonLocked());
        ldapDemoUser.setCredentialsNonExpired(details.isCredentialsNonExpired());
        Set<LdapDemoRole> ldapDemoRoles = mapToRoles(details.getAuthorities());
        ldapDemoUser.setAuthorities(ldapDemoRoles);
        return ldapDemoUser;
    }

    // set of persistent roles
    private Set<LdapDemoRole> mapToRoles(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .map(this::saveOrUpdateRole)
                .collect(Collectors.toSet());
    }

    private LdapDemoRole saveOrUpdateRole(String authority) {
        LdapDemoRole byAuthority = ldapDemoRoleRepository.findByAuthority(authority);
        if (byAuthority != null) {
            return byAuthority;
        } else {
            LdapDemoRole ldapDemoRole = new LdapDemoRole();
            ldapDemoRole.setAuthority(authority);
            return ldapDemoRoleRepository.save(ldapDemoRole);
        }
    }

    @Override
    public void createUser(UserDetails user) {
        ldapDemoUserRepository.save(mapToUser(user));
    }

    @Override
    public void updateUser(UserDetails details) {
        LdapDemoUser ldapDemoUser = ldapDemoUserRepository.findByUsername(details.getUsername());
        if (ldapDemoUser == null) {
            throw new IllegalStateException();
        }
        ldapDemoUser.setUsername(details.getUsername());
        ldapDemoUser.setPassword(details.getPassword());
        ldapDemoUser.setEnabled(details.isEnabled());
        ldapDemoUser.setAccountNonExpired(details.isAccountNonExpired());
        ldapDemoUser.setAccountNonLocked(details.isAccountNonLocked());
        ldapDemoUser.setCredentialsNonExpired(details.isCredentialsNonExpired());
        ldapDemoUser.setAuthorities(mapToRoles(details.getAuthorities()));
    }

    @Override
    public void deleteUser(String username) {
        LdapDemoUser byUsername = ldapDemoUserRepository.findByUsername(username);
        if (byUsername != null) {
            ldapDemoUserRepository.delete(byUsername);
        }
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        throw new UnsupportedOperationException();
    }

    @Override
    public boolean userExists(String username) {
        return ldapDemoUserRepository.existsByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return ldapDemoUserRepository.findByUsername(username);
    }
}
