package org.demo.db.user.management;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    boolean existsByAuthority(String authority);

    Role findByAuthority(String authority);
}
