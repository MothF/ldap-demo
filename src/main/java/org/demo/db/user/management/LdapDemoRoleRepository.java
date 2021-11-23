package org.demo.db.user.management;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LdapDemoRoleRepository extends JpaRepository<LdapDemoRole, Long> {
    boolean existsByAuthority(String authority);

    LdapDemoRole findByAuthority(String authority);
}
