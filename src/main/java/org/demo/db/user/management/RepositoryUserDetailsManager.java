package org.demo.db.user.management;

import lombok.SneakyThrows;
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

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public RepositoryUserDetailsManager(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public User mapToUser(UserDetails details) {
        User user = new User();
        user.setUsername(details.getUsername());
        user.setPassword(details.getPassword());
        user.setEnabled(details.isEnabled());
        user.setAccountNonExpired(details.isAccountNonExpired());
        user.setAccountNonLocked(details.isAccountNonLocked());
        user.setCredentialsNonExpired(details.isCredentialsNonExpired());
        Set<Role> roles = mapToRoles(details.getAuthorities());
        user.setAuthorities(roles);
        return user;
    }

    // set of persistent roles
    private Set<Role> mapToRoles(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .map(this::saveOrUpdateRole)
                .collect(Collectors.toSet());
    }

    @SneakyThrows
    private Role saveOrUpdateRole(String authority) {
        Role byAuthority = roleRepository.findByAuthority(authority);
        if (byAuthority != null) {
            return byAuthority;
        } else {
            Role role = new Role();
            role.setAuthority(authority);
            return roleRepository.save(role);
        }
    }

    @Override
    public void createUser(UserDetails user) {
        userRepository.save(mapToUser(user));
    }

    @Override
    public void updateUser(UserDetails details) {
        User user = userRepository.findByUsername(details.getUsername());
        if (user == null) {
            throw new IllegalStateException();
        }
        user.setUsername(details.getUsername());
        user.setPassword(details.getPassword());
        user.setEnabled(details.isEnabled());
        user.setAccountNonExpired(details.isAccountNonExpired());
        user.setAccountNonLocked(details.isAccountNonLocked());
        user.setCredentialsNonExpired(details.isCredentialsNonExpired());
        user.setAuthorities(mapToRoles(details.getAuthorities()));
    }

    @Override
    public void deleteUser(String username) {
        User byUsername = userRepository.findByUsername(username);
        if (byUsername != null) {
            userRepository.delete(byUsername);
        }
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        throw new UnsupportedOperationException();
    }

    @Override
    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }
}
